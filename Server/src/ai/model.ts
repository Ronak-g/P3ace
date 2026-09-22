import { createGoogle } from "@ai-sdk/google";
import { env } from "../config/env.ts";

const google = createGoogle({ apiKey: env.GEMINI_API });


export const model = google("gemini-3.5-flash-lite");