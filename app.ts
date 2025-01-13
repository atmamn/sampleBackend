import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import "dotenv/config";

const app = express();
const server = http.createServer(app); // Create HTTP server

app.use(helmet());
app.use(
  cors({
    origin: [
      "https://evenue-drab.vercel.app",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5500", // for admin
      "http://127.0.0.1:5173",
      "http://localhost:5173",
    ],
  })
);
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import usersRouter from "./routes/users/users";

// use routes
app.use("/api/v1/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Evenue API is running...");
});

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}...`);
});
