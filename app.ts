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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import usersRouter from "./routes/users/users";
import eventsRouter from "./routes/events/events";
import venuesRouter from "./routes/venues/venues";
import eventServicesRouter from "./routes/eventServices/eventServices";
import eventsShowcaseRouter from "./routes/eventsShowcase/eventsShowcase";
import shortVideoRouter from "./routes/shortVideos/shortVideos";
import storyRouter from "./routes/story/story";
import groupRouter from "./routes/groups/groups";
import chatRouter from "./routes/chat/chat";
import payStackRouter from "./routes/paystack/paystack";
import adminRouter from "./routes/admin/admin";

// use routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/events", eventsRouter);
app.use("/api/v1/venues", venuesRouter);
app.use("/api/v1/eventServices", eventServicesRouter);
app.use("/api/v1/eventsShowcase", eventsShowcaseRouter);
app.use("/api/v1/shortVideos", shortVideoRouter);
app.use("/api/v1/story", storyRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/paystack", payStackRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Evenue API is running...");
});

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}...`);
});
