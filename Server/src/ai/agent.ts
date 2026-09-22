import { generateText, stepCountIs } from "ai";
import { model } from "./model.ts";
import { createTools } from "./tools.ts";

export type ChatMessageInput = {
  role: "user" | "assistant";
  content: string;
};

export const runAgent = async (
  userId: string,
  messages: ChatMessageInput[],
) => {
  const result = await generateText({
    model,
    tools: createTools(userId),
    stopWhen: stepCountIs(5),
    system:
      "You are a task management assistant. Use the available tools to view, create, update, and delete the user's tasks. Use getCurrentTimeIndia whenever you need the current date or time.",
    messages,
  });

  return result.text;
};
