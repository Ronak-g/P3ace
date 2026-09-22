import type { ObjectId } from "mongoose";
import Task from "../models/Tasks.model.ts";

type UpdateTaskData = {
  title?: string;
  importance?: "low" | "medium" | "high";
  date?: Date;
  status?: "pending" | "completed";
};

export const getTasksHelper = async (userId: string) => {
  const tasks = await Task.find({ userId });
  return tasks;
};

export const createTaskHelper = async (
  title: string,
  importance: "low" | "medium" | "high" | undefined,
  date: Date | undefined,
  userId: string,
) => {
  const task = await Task.create({
    title,
    ...(importance !== undefined && { importance }),
    ...(date !== undefined && { date }),
    userId,
});
  return task;
};

export const patchTaskHelper = async (
  userId: string,
  id: string,
  body: UpdateTaskData,
) => {
  const task = await Task.findOneAndUpdate({ _id: id, userId: userId }, body, {
    new: true,
  });
  return task;
};

export const deleteTaskHelper = async (id: string, userId: string) => {
  const task = await Task.findOneAndDelete({ _id: id, userId });
  return task;
};

export const getTaskByIdHelper = async (id: string, userId: string) => {
  const task = await Task.findOne({ _id: id, userId });
  return task;
};