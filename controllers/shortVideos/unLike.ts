import express, { Request, Response } from "express";
import { ResultSetHeader } from "mysql2";
import pool from "../../db/db";
import getUserIDAndToken from "../users/getUserIdFromToken";

export const unLike: express.RequestHandler = (req: Request, res: Response) => {
  const { video_id }: { video_id: number } = req.body;
  console.log({ video_id });

  if (!video_id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const { user_id } = getUserIDAndToken(req);
  console.log({ user_id });

  if (!user_id) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const strVideoId = video_id.toString();

  try {
    pool.execute<ResultSetHeader>(
      `
      DELETE FROM short_videos_likes
WHERE fk_user_id = ? AND fk_video_id = ?;
            `,
      [user_id, strVideoId],
      (err) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        res.status(200).json({ message: "unLike successfull" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
