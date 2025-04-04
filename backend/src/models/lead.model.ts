import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  source: {
    type: String,
    required: true,
  },
  flowchartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flowchart",
  },
  status: {
    type: String,
    enum: ["active", "completed", "unsubscribed"],
    default: "active",
  },
  currentNodeId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Lead = mongoose.model("Lead", LeadSchema);