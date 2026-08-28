import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Express } from "express";
import ConnectDB from "./db/db.js";
import cors from "cors";

const port = process.env.PORT || 3000;
const app: Express = express();


ConnectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

app.use(
  cors({
    origin: process.env.FRONTEND_URI || 'http://localhost:5173',
    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.send("Hello from TypeScript!");
});

app.get("/ronak", (req, res) => {
  res.send("hello ronak");
});
