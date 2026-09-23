import mongoose from "mongoose";

export interface ITask{
    userId : mongoose.Types.ObjectId;
    title : string;
    importance : "low" | "medium" | "high";
    date? : Date;
    status : "pending" | "completed"

}

const TaskSchema = new mongoose.Schema<ITask>({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
        type: String,
        required: true,
    },
    importance: {
        type : String,
        enum: ["low", "medium", "high"],
        default : "medium",
    },
    date : Date,
    status : {
        type : String,
        enum: ["pending", "completed"],
        default : "pending",
    }
},{timestamps: true});

export default mongoose.model<ITask>("Task", TaskSchema);
