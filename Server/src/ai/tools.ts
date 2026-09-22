import { tool } from "ai";
import { z } from "zod";
import {
  getTasksHelper,
  createTaskHelper,
  deleteTaskHelper,
  patchTaskHelper,
} from "../services/Task.Services.ts";

export const createTools = (userId: string) => ({
  getAllTasks: tool({
    description: "Get all tasks belonging to the current user",
    inputSchema: z.object({}),
    execute: async () => {
      return await getTasksHelper(userId);
    },
  }),

  createTask: tool({
    description: "Create a new task for the current user",
    inputSchema: z.object({
      title: z.string(),
      importance: z.enum(["low", "medium", "high"]).optional(),
      date: z.string().optional().describe("ISO date string"),
    }),
    execute: async ({ title, importance, date }) => {
      return await createTaskHelper(
        title,
        importance,
        date ? new Date(date) : undefined,
        userId,
      );
    },
  }),

  deleteTask: tool({
    description: "Delete a task by its id",
    inputSchema: z.object({
      id: z.string(),
    }),
    execute: async ({ id }) => {
      const task = await deleteTaskHelper(id, userId);
      if (!task) return { success: false, message: "Task not found" };
      return { success: true };
    },
  }),

  patchTask: tool({
    description:
      "Update a task's title, importance, date, or status by its id",
    inputSchema: z.object({
      id: z.string(),
      title: z.string().optional(),
      importance: z.enum(["low", "medium", "high"]).optional(),
      date: z.string().optional().describe("ISO date string"),
      status: z.enum(["pending", "completed"]).optional(),
    }),
    execute: async ({ id, title, importance, date, status }) => {
      const body: {
        title?: string;
        importance?: "low" | "medium" | "high";
        date?: Date;
        status?: "pending" | "completed";
      } = {};
      if (title !== undefined) body.title = title;
      if (importance !== undefined) body.importance = importance;
      if (date !== undefined) body.date = new Date(date);
      if (status !== undefined) body.status = status;

      const task = await patchTaskHelper(userId, id, body);
      if (!task) return { success: false, message: "Task not found" };
      return task;
    },
  }),

  getCurrentTimeIndia: tool({
    description: "Get the current date and time in India (IST)",
    inputSchema: z.object({}),
    execute: async () => {
      return new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "medium",
      });
    },
  }),
});
