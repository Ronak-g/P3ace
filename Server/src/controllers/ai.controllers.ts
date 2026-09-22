import type { AuthenticatedRequest } from "../Middleware/AuthMiddleware.ts";
import type { Response } from "express";
import { runAgent } from "../ai/agent.ts";
import ChatMessage from "../models/ChatMessage.model.ts";

export const chat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const history = await ChatMessage.find({ userId }).sort({ createdAt: 1 });
    const messages = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    messages.push({ role: "user", content: message });

    const reply = await runAgent(userId, messages);

    await ChatMessage.create({ userId, role: "user", content: message });
    await ChatMessage.create({ userId, role: "assistant", content: reply });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("chat error:", error);
    return res.status(500).json({ message: "Failed to process chat message" });
  }
};

export const getChatHistory = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user._id;
    const history = await ChatMessage.find({ userId }).sort({ createdAt: 1 });
    return res.status(200).json(history);
  } catch (error) {
    console.error("getChatHistory error:", error);
    return res.status(500).json({ message: "Failed to fetch chat history" });
  }
};
