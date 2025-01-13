import express, { Request, Response } from "express";
import pool from "../../db/db";
import { RowDataPacket } from "mysql2";

// add check for admin
export const adminList: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  pool.execute<RowDataPacket[]>(
    "SELECT user_id, first_name, last_name, email FROM users;",
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      } else if (result.length === 0) {
        res.status(404).json({ error: "No users found" });
        return;
      }
      res.status(200).json({ result });
    }
  );
};
