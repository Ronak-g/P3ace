import express from "express";
import mongoose from "mongoose";

export default async function ConnectDB() {
  try {
    const connectDatabse = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("COnnected to Database successfully");
  } catch (error) {
    console.log(`failed to connect to db, error: ${error}`);
    process.exit(1);
  }
}
