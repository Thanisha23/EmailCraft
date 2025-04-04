import { Request, Response } from "express";
import { Flowchart } from "../models/flowchart.model";

interface AuthRequest extends Request {
  userId?: string;
}
interface FlowchartNode {
  type: string;
  data?: {
    emailList?: string | string[];
  };
}
export const createFlowchart = async (req: AuthRequest, res: Response) => {
  try {
    const { name, nodes, edges } = req.body;

    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (!name || !nodes || !edges) {
      res.status(400).json({
        message: "Please provide all required fields",
      });
      return;
    }

    interface FlowchartNode {
      type: string;
      data?: {
        emailList?: string | string[];
      };
    }

    const processedNodes = nodes.map((node: FlowchartNode) => {
      if (node.type === "leadSource" && node.data && node.data.emailList) {
        if (typeof node.data.emailList === "string") {
          node.data.emailList = node.data.emailList
            .split(",")
            .map((email) => email.trim());
        }
      }
      return node;
    });

    const flowchart = await Flowchart.create({
      userId: req.userId,
      name,
      nodes: processedNodes,
      edges,
    });

    if (!flowchart) {
      res.status(400).json({
        message: "Error creating flowchart",
      });
      return;
    }

    res.status(201).json({
      message: "Flowchart created successfully",
      flowchart,
    });
    return;
  } catch (error) {
    console.error("Error creating flowchart:", error);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

export const getFlowcharts = async (req: AuthRequest, res: Response) => {
  try {
    const flowcharts = await Flowchart.find({
      userId: req.userId,
    });
    if (!flowcharts) {
      res.status(404).json({
        message: "No flowcharts found",
      });
      return;
    }
    res.status(200).json({
      message: "Flowcharts fetched successfully",
      flowcharts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getFlowchartById = async (req: AuthRequest, res: Response) => {
  try {
    const flowchart = await Flowchart.findOne({
      userId: req.userId,
      _id: req.params.id,
    });
    if (!flowchart) {
      res.status(404).json({
        message: "Flowchart not found",
      });
      return;
    }
    res.status(200).json({
      message: "Flowchart fetched successfully",
      flowchart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateFlowchart = async (req: AuthRequest, res: Response) => {
  try {
    const { name, nodes, edges } = req.body;

    if (!name || !nodes || !edges) {
      res.status(400).json({
        message: "Please provide all required fields",
      });
      return;
    }

    const processedNodes = nodes.map((node: FlowchartNode) => {
      if (node.type === "leadSource" && node.data && node.data.emailList) {
        if (typeof node.data.emailList === "string") {
          node.data.emailList = node.data.emailList
            .split(",")
            .map((email) => email.trim());
        }
      }
      return node;
    });

    const flowchart = await Flowchart.findOne({
      userId: req.userId,
      _id: req.params.id,
    });

    if (!flowchart) {
      res.status(404).json({
        message: "Flowchart not found",
      });
      return;
    }

    flowchart.name = name;
    flowchart.nodes = processedNodes;
    flowchart.edges = edges;
    flowchart.updatedAt = new Date();

    await flowchart.save();

    res.status(200).json({
      message: "Flowchart updated successfully",
      flowchart,
    });
  } catch (error) {
    console.error("Error updating flowchart:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteFlowchart = async (req: AuthRequest, res: Response) => {
  try {
    const flowchart = await Flowchart.findOne({
      userId: req.userId,
      _id: req.params.id,
    });
    if (!flowchart) {
      res.status(404).json({
        message: "Flowchart not found",
      });
      return;
    }
    await flowchart.deleteOne();
    res.status(200).json({
      message: "Flowchart deleted successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
