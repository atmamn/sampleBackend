import express, { Request, Response } from "express";
import pool from "../../db/db";
import { ResultSetHeader } from "mysql2";
import nodemailerFn from "../../nodemailer/nodemailer";

// need to check that the number generated has not been previously generated/ generated & invalidated.
// delete all asscoiated codes if new code is requested. Invalidate a code after 3 hours
export const forgotPassword1stStep: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email }: { email: string } = req.body;
  console.log({ email });

  // Generate 6 random numbers that will be sent to the email address of the assumed user
  const randomNumbers = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10)
  );

  // Send the random numbers to the user's email address
  const message = `<div>
    <h1>${randomNumbers.join("")}</h1>
    <p>Please don't share this code with anyone. Expires in 3 hours</p>
    <p>Ignore this message if you didn't request a password reset.</p>
  </div>`; // move to the messages folder and add inline css
  const subject = "Password Reset";
  const text = `${randomNumbers.join("")}`;
  nodemailerFn(message, email, subject, text);

  // Convert randomNumbers to string
  const randomNumbersString = randomNumbers.join("");
  console.log({ randomNumbersString });

  // Save the random numbers in the database
  const saveRandomNumbers = (
    randomNumbersString: string,
    email: string
  ): Promise<ResultSetHeader> => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO forgot_password_codes (code, request_email) VALUES (?, ?)";
      const values = [randomNumbersString, email];

      pool.execute<ResultSetHeader>(query, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  // Call the saveRandomNumbers function to save the random numbers in the database
  try {
    await saveRandomNumbers(randomNumbersString, email);
    console.log("Random numbers saved in the database.");
    res
      .status(200)
      .json({ message: "Random numbers successfully saved in the database." });
  } catch (error) {
    console.error("Error saving random numbers:", error);
    res.status(500).json({ error: "Failed to save random numbers." });
  }
};
