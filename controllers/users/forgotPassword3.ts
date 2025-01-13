import express, { Request, Response } from "express";
import pool from "../../db/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
  hashPassword,
  generateSalt,
} from "../../middleware/bcrypt/bcryptUtils";

/**
 * select from the db where the email has a code that has a verified status of true. If none, send an error else change password
 */
export const forgotPassword3rdStep: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  // get the details from body
  const { email, newPassword }: { email: string; newPassword: string } =
    req.body;

  const saltRounds = 10;
  const salt = await generateSalt(saltRounds);
  const hash = await hashPassword(newPassword, salt);

  // check if the code exists in the database, if the password is not older than 24 hours.
  pool.getConnection((error, connection) => {
    if (error) {
      // Handle connection error
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
      return;
    } else {
      try {
        connection.query("START TRANSACTION;", (error) => {
          if (error) {
            // Handle transaction start error
            res.status(500).json({ error: "Internal server error" });
            return;
          } else {
            // check if the user has a code that has a verified status of true and code timestamp is not greater than 3 hours.

            connection.query<RowDataPacket[]>(
              `
              SELECT code_id 
FROM forgot_password_codes 
WHERE verified = 'true' AND request_email = ? AND TIMESTAMPDIFF(HOUR, timestamp, NOW()) < 3
ORDER BY code_id DESC LIMIT 1;
              `,
              [email],
              (error, result) => {
                if (error) {
                  // Handle query error
                  console.error(error);
                  res.status(500).json({ error: "Internal server error" });
                  return;
                } else if (result.length === 0) {
                  res.status(404).json({ error: "No code found" });
                  return;
                } else {
                  // delete every code from the table with a time > 3hrs. This should be eventually done by a crone job aka automated
                  connection.query<ResultSetHeader>(
                    `
                    DELETE FROM forgot_password_codes
WHERE TIMESTAMPDIFF(HOUR, timestamp, NOW()) > 3;
                    `,
                    (error) => {
                      if (error) {
                        // Handle image insert error
                        console.error(error);
                        res
                          .status(500)
                          .json({ error: "Internal server error" });
                        return;
                      } else {
                        // allow password change
                        connection.query<ResultSetHeader>(
                          `
                          UPDATE users SET password = ?
WHERE email = ?;
                          `,
                          [hash, email],
                          (error) => {
                            if (error) {
                              // Handle image insert error
                              console.error(error);
                              res
                                .status(500)
                                .json({ error: "Internal server error" });
                              return;
                            }

                            connection.query("COMMIT;", (error) => {
                              if (error) {
                                try {
                                  connection.query("ROLLBACK;");
                                } catch (rollbackError) {
                                  // Handle rollback error
                                  console.error(rollbackError);
                                }
                                res
                                  .status(500)
                                  .json({ error: "Internal server error" });
                              } else {
                                res.status(200).json({
                                  message: "password change successful",
                                });
                              }
                            });
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      } catch (error) {
        connection.query("ROLLBACK;", (rollbackError) => {
          // Handle rollback error
          console.error(rollbackError);
        });
        res.status(500).json({ error: "Internal server error" });
      } finally {
        connection.release(); // Return connection to pool
      }
    }
  });
};
