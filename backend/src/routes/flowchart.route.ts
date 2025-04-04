import { Router } from "express";
import { createFlowchart, deleteFlowchart, getFlowchartById, getFlowcharts, updateFlowchart } from "../controllers/flowchart.controller";

const flowchartRouter = Router()

flowchartRouter.post("/",createFlowchart)
flowchartRouter.get("/",getFlowcharts)
flowchartRouter.get("/:id",getFlowchartById)
flowchartRouter.put("/:id",updateFlowchart)
flowchartRouter.delete("/:id",deleteFlowchart)

export default flowchartRouter