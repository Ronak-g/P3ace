import Client from "./Client";

export interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

const getChatHistory = () => Client.get("/ai/");
const sendMessage = (message: string) => Client.post("/ai/", { message });

export { getChatHistory, sendMessage };
