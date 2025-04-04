import mongoose from "mongoose";

const EmailScheduleSchema = new mongoose.Schema({
  flowchartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flowchart",
    required: true,
  },
  nodeId: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "sent", "failed"],
    default: "scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export const EmailSchedule = mongoose.model(
    "EmailSchedule",
    EmailScheduleSchema
  );