import express, { Request, Response } from "express";
import pool from "../../db/db";
import { RowDataPacket } from "mysql2";
export const forgotPassword2ndStep: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { code, email }: { code: string; email: string } = req.body;

  // verify the code and change the status if it is valid and associated with the correct email

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
            // check if the code received matches exsist in the db and if the email recieved matches the code email in the db

            connection.query<RowDataPacket[]>(
              `SELECT code_id, code, request_email FROM forgot_password_codes WHERE code = ? AND request_email = ?;`,
              [code, email],
              (error, result) => {
                if (error) {
                  // Handle query error
                  console.error(error);
                  res.status(500).json({ error: "Internal server error" });
                  return;
                } else if (result.length === 0 || result.length > 1) {
                  res.status(401).json({ error: "Unauthorized" });
                } else {
                  connection.query<RowDataPacket[]>(
                    `UPDATE forgot_password_codes SET verified = 'true' WHERE code = ? AND request_email = ?;`,
                    [code, email],
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
                          res
                            .status(200)
                            .json({ message: "code verified successfully" });
                        }
                      });
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
