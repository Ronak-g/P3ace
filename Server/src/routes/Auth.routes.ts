import { Router } from "express";
import User from "../models/User.model.ts";
import jwt from "jsonwebtoken";
import { authMiddleware, type userdata } from "../Middleware/AuthMiddleware.ts";
import { env } from "../config/env.ts";
import type { Request, Response } from "express";
import { RefreshTokenPayload } from "../services/Jwt.Services.ts";

// make a service to eliminate code that is repeated (later)...
const router = Router();
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUm9uYWsgIiwiaWF0IjoxNzg4NTEzODYwLCJleHAiOjE3ODk4MDk4NjB9._G4T2sXnahndVXcNWoy5OF1Nz86Vw_flKR2x4y-o2PU
router.post("/refresh", async (req, res) => {
  //agar access token fat gaya h to...
  try {
    const token = req.cookies.refreshToken || undefined;
    if (!token) return res.status(400).send(`no token found`);
    const refreshPayload = RefreshTokenPayload(token);
    const { name } = refreshPayload;

    const user = await User.findOne({ name });
    if (user == null) return res.status(401).send(`You are not authenticated`);

    if (token !== user?.refreshToken)
      return res.status(400).send(`this token is wrong`);

    const { accessToken, refreshToken } =
      await user.generateAccessAndRefreshTokens();

    await user.updateOne({ $set: { refreshToken: refreshToken } });

    const options = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    } as const;

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .send("refreshed session");
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      return res.status(401).send(`pls login again, token expired`);

    res
      .status(500)
      .send(
        `an error occured in refreshing cookie\n to fix look into routes/auth.js `,
      );
    console.error(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    console.log(req.body);

    if (!(name && password && email)) {
      return res.status(400).send("pls enter Credentials");
    }

    const email_Lower = email.toLowerCase();
    if (!(email_Lower.includes("@") && email_Lower.includes(".")))
      return res.status(400).send("email is invalid");

    if (password.length < 8)
      return res.status(400).send(`passwords needs be 8 char or more`);

    const user = await User.create({
      name: name,
      password: password,
      email: email_Lower,
    });

    const { accessToken, refreshToken } =
      await user.generateAccessAndRefreshTokens();

    await user.updateOne({ $set: { refreshToken: refreshToken } });

    const options = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    } as const;

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User created",
        _id: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    console.error(error);

    res
      .status(500)
      .send(
        `an error occured in creating user\n to fix look into routes/auth.js `,
      );
    console.error(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // console.log(`body`, name, password);
    if (!(name && password))
      return res.status(401).send(`please enter Credentials`);

    const user = await User.findOne({ name });
    if (!user) return res.status(401).send(`Wrong Credentials`);

    // console.log(`hey`);

    const isPassCorrect = await user.checkPassword(password);
    if (!isPassCorrect) return res.status(401).send(`incorrect password`);

    const { accessToken, refreshToken } =
      await user.generateAccessAndRefreshTokens();

    // console.log(refreshToken);

    await user.updateOne({ $set: { refreshToken: refreshToken } });

    const updatedUser = await User.findOne({ name });
    if (!updatedUser)
      throw new Error(
        `something went while fetching upadtes user in file auth routes`,
      );
    const dbtoken = updatedUser.refreshToken;
    console.log(refreshToken);
    console.log();
    console.log(refreshToken === dbtoken);

    const options = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    } as const;

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
      });
  } catch (error) {
    res
      .status(500)
      .send(
        `an error occured in logging user\n to fix look into routes/auth.js `,
      );
    console.error(error);
  }
});

router.post("/logout", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name } = req.user as userdata; // though auth middleware we will place user data in this
    const user = await User.findOne({ name });
    if (!user) return res.status(401).send(`not authenticated`);
    await user.updateOne({ $set: { refreshToken: undefined } });

    const options = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    } as const;

    res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .send("logged out successfully");
  } catch (error) {
    res
      .status(500)
      .send(
        `an error occured in logging user\n to fix look into routes/auth.js `,
      );
    console.error(error);
  }
});

export default router;
