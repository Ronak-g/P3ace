import type { AuthenticatedRequest } from "../Middleware/AuthMiddleware.ts";
import Task from "../models/Tasks.model.ts";
import type { Response } from "express";

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const tasks = await Task.find({ userId });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("getTasks error:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { title, importance, date } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      importance,
      date,
      userId,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("createTask error:", error);
    return res.status(500).json({ message: "Failed to create task" });
  }
};

export const patchTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: userId },
      req.body,
      { new: true },
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    return res.status(200).json({ task });
  } catch (error) {
    console.error("patchTask error:", error);
    return res.status(500).json({ message: "Failed to patch task" });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ message: `Successfully deleted task` });
  } catch (error) {
    console.error("deleting task error: ", error);
    return res.status(500).json({ message: "failed to delete task" });
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const task = await Task.findOne({ _id: req.params.id, userId });
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).send(task);
  } catch (error) {
    console.error("error in getting task by id : ", error);
    return res.status(500).json({ message: "failed to fetch task" });
  }
};
