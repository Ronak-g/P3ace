import Client from "./Client";

interface taskData{
  title?: string;
  importance?: "low" | "medium" | "high";
  date?: Date;
  status?: "pending" | "completed";
}

const getTasks = () => Client.get("/task/");
const getTask = (id : string) => Client.get(`/task/${id}`);
const createTask = (data: taskData) => Client.post("/task/", data);
const patchTask = (id : string, data: taskData) => Client.patch(`/task/${id}`, data);
const deleteTask = (id : string) => Client.delete(`/task/${id}`);

export { getTask, getTasks, createTask, patchTask, deleteTask };
