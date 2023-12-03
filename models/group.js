import mongoose, { Schema, models, model } from "mongoose";
import Task from "./task";

const taskSchema = new Schema(
  {
    //   _id: { type: Schema.Types.ObjectId, default: new mongoose.Types.ObjectId() },
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
  }
  // { _id: true }
);
const groupSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter group name"],
    trim: true,
  },
  owners: [],
  tasks: [],
});

const Group = models.Group || model("Group", groupSchema);

export default Group;
