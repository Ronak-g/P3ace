import { Router, type RequestHandler } from "express";
import { chat, getChatHistory } from "../controllers/ai.controllers.ts";

const router = Router();

router.get("/", getChatHistory as RequestHandler);
router.post("/", chat as RequestHandler);

export default router;
