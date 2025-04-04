import { Request, Response } from "express";
import { scheduleEmail } from "../services/agendaService";
import { processFlowchart } from "../services/flowchartProcessor";

interface AuthRequest extends Request {
  userId?: string;
}

export const scheduleEmailController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { to, subject, body, date } = req.body;

    if (!to || !subject || !body || !date) {
      res.status(400).json({
        message: "Please provide all required fields",
      });
      return;
    }
    await scheduleEmail(to, subject, body, new Date(date));
    res.status(200).json({
      message: "Email scheduled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

export const processFlowchartController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { flowchartId } = req.params;

    if (!flowchartId) {
      res.status(400).json({
        message: "Flowchart ID is required",
      });
      return;
    }

    const result = await processFlowchart(flowchartId);

    if (result.success) {
      res.status(200).json({
        message: result.message,
      });
    } else {
      res.status(400).json({
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error processing flowchart:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
