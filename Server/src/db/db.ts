import mongoose from "mongoose";
import { env } from "../config/env.ts";


export default async function ConnectDB() {
  try {
    const connectDatabse = await mongoose.connect(`${env.MONGODB_URI}`);
    console.log("COnnected to Database successfully");
  } catch (error) {
    console.log(`failed to connect to db, error: ${error}`);
    process.exit(1);
  }
}
