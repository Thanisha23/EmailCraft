import { Router } from "express";
import { getJobsStatus } from "../controllers/jobs.controller";

const jobsStatusRouter = Router({mergeParams: true});

jobsStatusRouter.get("/jobs",getJobsStatus)

export default jobsStatusRouter