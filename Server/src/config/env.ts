import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const env = {
  PORT: required("PORT"),
  MONGODB_URI: required("MONGODB_URI"),
  NODE_ENV: required("NODE_ENV"),
  FRONTEND_URI: required("FRONTEND_URI"),
  TOKEN_SECRET: required("TOKEN_SECRET"),
  BCRYPT_SECRET: required("BCRYPT_SECRET"),
};
