import express, { Request, Response } from "express";
import pool from "../../../db/db";
import { RowDataPacket } from "mysql2";
export const deleteAdvert: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { ad_id } = req.params;
  if (!ad_id) {
    res.status(400).json({ error: "Missing ad_id" });
  }
  pool.query<RowDataPacket[]>(
    "DELETE FROM ad_section WHERE id = ?;",
    [ad_id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
      } else if (results.length === 0) {
        res.status(404).json({ error: "No results found" });
        return;
      }
      res.status(200).json({ message: "successful" });
    }
  );
};
