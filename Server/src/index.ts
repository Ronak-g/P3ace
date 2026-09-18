import { env } from "./config/env.ts";
import express from "express";
import type { Express } from "express";
import ConnectDB from "./db/db.ts";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from './routes/Auth.routes.ts'

const port = env.PORT || 3000;
const app: Express = express();


ConnectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

app.use(
  cors({
    origin: env.FRONTEND_URI || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes)
