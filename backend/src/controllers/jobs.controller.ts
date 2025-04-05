import { Request, Response } from "express";
import { getScheduledJobs } from "../services/agendaService";

export const getJobsStatus = async (req: Request, res: Response) => {
  try {
    const jobs = await getScheduledJobs();
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("Error getting scheduled jobs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get job status"
    });
  }
};