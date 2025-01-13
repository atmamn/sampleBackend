import express, { Request, Response } from "express";
import pool from "../../../db/db";
import { RowDataPacket } from "mysql2";
import getUserIDAndToken from "../getUserIdFromToken";

// add check for admin
export const verifyEventService: express.RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { user_id } = getUserIDAndToken(req);

  const { event_services_id } = req.params;

  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  pool.execute<RowDataPacket[]>(
    "UPDATE event_services SET verified = '1' WHERE id = ?;",
    [event_services_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        return;
      } else if (result.length === 0) {
        res.status(404).json({ error: "No event services found" });
        return;
      }
      res.status(200).json({ message: "Event services verified successfully" });
    }
  );
};
