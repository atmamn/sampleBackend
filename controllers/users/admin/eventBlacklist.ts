import express, { Request, Response } from "express";
import pool from "../../../db/db";
import { RowDataPacket } from "mysql2";
import getUserIDAndToken from "../getUserIdFromToken";

type ParamsProps = {
  event_id: string;
  action: "blacklist" | "unblacklist";
};
// add check for admin
export const blackListEvent: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { user_id } = getUserIDAndToken(req);

  const { event_id, action } = req.params as ParamsProps;

  if (!user_id || !event_id || !action) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  let sql: string;
  if (action === "blacklist") {
    sql = "UPDATE events SET blacklist = '1' WHERE event_id = ?;";
  } else if (action === "unblacklist") {
    sql = "UPDATE events SET blacklist = '0' WHERE event_id = ?;";
  } else {
    res.status(400).json({ error: "Invalid action" });
    return;
  }

  const res1 = action === "blacklist" ? "blacklisted" : "unblacklisted";
  pool.execute<RowDataPacket[]>(sql, [event_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
      return;
    } else if (result.length === 0) {
      res.status(404).json({ error: "No event found" });
      return;
    }
    res.status(200).json({ message: "Event " + res1 + " successfully" });
  });
};
