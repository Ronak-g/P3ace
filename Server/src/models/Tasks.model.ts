import mongoose from "mongoose";

interface Task{
    userId : string;
    title : string;
    time : number;
    importance : "low" | "medium" | "high";
    date : Date;
    status : "pending" | "Completed"

}

const TaskSchema = new mongoose.Schema({

});

export default mongoose.model("Task", TaskSchema)