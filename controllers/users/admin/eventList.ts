import express, { Request, Response } from "express";
import pool from "../../../db/db";
import { RowDataPacket } from "mysql2";

// add check for admin
export const eventList: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  pool.execute<RowDataPacket[]>(
    "SELECT event_id, name, blacklist FROM events;",
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      } else if (result.length === 0) {
        res.status(404).json({ error: "No events found" });
        return;
      }
      res.status(200).json({ result });
    }
  );
};
