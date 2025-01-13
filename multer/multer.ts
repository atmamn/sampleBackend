import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";

// set path based on production or development
const uploadDir =
  process.env.NODE_ENV === "production" ? "public/uploads" : "dev";

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueIdentifier = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueIdentifier + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg|webp|avif)$/i)) {
    return cb(null, false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });
