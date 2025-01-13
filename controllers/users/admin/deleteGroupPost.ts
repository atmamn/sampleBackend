import express, { Request, Response } from "express";
import pool from "../../../db/db";
import { RowDataPacket } from "mysql2";

// add check for admin
export const deleteGroupPost: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user_id = req.params.group_post_id;
  if (!user_id) {
    res.status(400).json({ error: "Missing user_id" });
    return;
  }
  pool.execute<RowDataPacket[]>(
    "DELETE FROM egroup_posts WHERE id = ?;",
    [user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      } else if (result.length === 0) {
        res.status(404).json({ error: "No group post found" });
        return;
      }
      res.status(200).json({ message: "Group post deleted successfully" });
    }
  );
};
