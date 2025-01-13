import express, { Request, Response } from "express";

import getUserIDAndToken from "../users/getUserIdFromToken";
import { RowDataPacket } from "mysql2";
import pool from "../../db/db";
export const checkIsAdmin: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { user_id } = getUserIDAndToken(req);

  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE user_id = ? AND is_admin = '1'",
      [user_id],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        if (result.length === 0) {
          res.status(401).json({ error: "Unauthorized" });
          return;
        }
        res.status(200).json({ message: "Admin access success" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
