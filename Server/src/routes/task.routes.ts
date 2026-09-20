import { Router, type RequestHandler } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  deleteTask,
  patchTask,
} from "../controllers/task.controllers.ts";

const router = Router();

router.get("/", getTasks as RequestHandler);
router.post("/", createTask as RequestHandler);
router.get("/:id", getTaskById as RequestHandler);
router.patch("/:id", patchTask as RequestHandler);
router.delete("/:id", deleteTask as RequestHandler)

export default router;
