import mongoose from "mongoose";

const FlowchartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nodes: [
    {
      id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["coldEmail", "delay", "leadSource"],
        required: true,
      },
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
      data: {
        subject: { type: String },
        body: { type: String },
        to: { type: String },
        delayTime: { type: Number },
        delayHours: { type: Number },
        delayMinutes: { type: Number },
        leadIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
        source: { type: String },
        emailList: [{ type: String }],
      },
    },
  ],
  edges: [
    {
      id: { type: String, required: true },
      source: { type: String, required: true },
      target: { type: String, required: true },
      sourceHandle: { type: String },
      targetHandle: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Flowchart = mongoose.model("Flowchart", FlowchartSchema);
