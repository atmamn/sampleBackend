import express, { Request, Response } from "express";
import pool from "../../db/db";
import { RowDataPacket } from "mysql2";
export const getAdvert: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  pool.query<RowDataPacket[]>(
    "SELECT id, img, url FROM ad_section LIMIT 3;",
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
      } else if (results.length === 0) {
        res.status(404).json({ error: "No results found" });
        return;
      }
      res.status(200).json({ results });
    }
  );
};
