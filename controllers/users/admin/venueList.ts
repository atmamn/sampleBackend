import express, { Request, Response } from "express";
import pool from "../../../db/db";
import { RowDataPacket } from "mysql2";

// add check for admin
export const venueList: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  pool.execute<RowDataPacket[]>(
    "SELECT id, title FROM venues;",
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      } else if (result.length === 0) {
        res.status(404).json({ error: "No venues found" });
        return;
      }
      res.status(200).json({ result });
    }
  );
};
