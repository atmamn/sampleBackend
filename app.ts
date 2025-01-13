import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import http from "http";
import WebSocket from "ws";
import "dotenv/config";

const app = express();
const server = http.createServer(app); // Create HTTP server

app.use(helmet());
app.use(
  cors({
    origin: [
      "https://main.dd5vkoxd0io57.amplifyapp.com",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5500", // for admin
      "http://127.0.0.1:5173",
      "http://localhost:5173",
    ],
    credentials: true,
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
import pool from "./db/db";

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws: WebSocket) {
  ws.on("error", console.error);

  // Handle incoming messages
  ws.on("message", function incoming(message) {
    console.log("receivedhdhh: %s", message);
    // Parse the incoming message
    const data = JSON.parse(message.toString());
    const userId = data.senderId;
    console.log({ rid: data.recipientId });
    console.log({ userId });

    // Save message to database and send to recipient
    saveMessageToDatabase(userId, data.recipientId, data.message);
    sendMessageToRecipient(userId, data.recipientId, data.message);
  });
});

// Function to save the message to the database
function saveMessageToDatabase(
  senderId: number,
  recipientId: number,
  message: string
) {
  const query =
    "INSERT INTO chat (fk_sender_id, fk_recipient_id, message) VALUES (?, ?, ?)";
  pool.execute(query, [senderId, recipientId, message], function (error) {
    if (error) throw error;
    console.log("Message saved to database");
  });
}

// Function to send the message to the recipient
function sendMessageToRecipient(
  senderId: number,
  recipientId: number,
  message: string
) {
  console.log({ send: { senderId, recipientId, message } });

  // Find the WebSocket connection of the recipient
  wss.clients.forEach(function outgoing(client: WebSocket) {
    // Check if the client is the recipient and send the message
    if (recipientId) {
      client.send(JSON.stringify({ senderId, recipientId, message }));
    }
  });
}

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
