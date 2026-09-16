import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const generateAccessAndRefreshTokens = (
  _id: string,
  name: string,
  email: string,
): Tokens => {
  const accessToken = jwt.sign(
    {
      _id: _id,
      name: name,
      email: email,
    },
    env.TOKEN_SECRET,
    {
      expiresIn: "1d",
    },
  );
  const refreshToken = jwt.sign(
    {
      name: name,
    },
    env.TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
  return { accessToken, refreshToken };
};

interface AccessPayload {
  _id : string,
  name : string,
  email : string
}

interface RefreshPayload {
  name : string
}

export const AccessTokenPayload = (token:string) => {
    const payload  = jwt.verify(token, env.TOKEN_SECRET);
    if(typeof payload == "string") throw new Error("The JWT Verification failed or a wrong token is used")
    return payload as AccessPayload;
}

export const RefreshTokenPayload = (token:string) => {
    const payload  = jwt.verify(token, env.TOKEN_SECRET);
    if(typeof payload == "string") throw new Error("The JWT Verification failed or a wrong token is used")
    return payload as RefreshPayload;
}