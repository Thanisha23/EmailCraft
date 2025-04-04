import { Router } from "express";
import { scheduleEmailController, processFlowchartController } from "../controllers/email.controller";
import authMiddleware from "../middleware/authMiddleware";

const emailRouter = Router({mergeParams: true});

emailRouter.post("/schedule", authMiddleware, scheduleEmailController);
emailRouter.post("/process-flowchart/:flowchartId", authMiddleware, processFlowchartController);

export default emailRouter;