import mongoose from "mongoose";

export interface IChatMessage {
  userId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
}

const ChatMessageSchema = new mongoose.Schema<IChatMessage>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
