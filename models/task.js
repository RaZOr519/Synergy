import mongoose, { Schema, models, model } from "mongoose";

const taskSchema = new Schema({
  groupId: {
    type: String,
    required: [true, "Please provide a group ID for the task"],
  },
  text: {
    type: String,
    required: [true, "Please provide task text"],
    trim: true,
  },
  deadline: {
    type: Date,
  },
});

const Task = models.Task || model("Task", taskSchema);

export default Task;
