import mongoose, { Schema, models, model } from "mongoose";

const taskSchema = new Schema({
  goalId: {
    type: String,
    required: [true, "Please provide a goal ID for the task"],
  },
  text: {
    type: String,
    required: [true, "Please provide task text"],
    trim: true,
  },
});

const goalSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter goal title"],
    trim: true,
  },
  tasks: [taskSchema],
  newTask: {
    type: String,
    default: "",
    trim: true,
  },
  newTaskDeadline: {
    type: Date,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Goal = models.Goal || model("Goal", goalSchema);

export default Goal;
