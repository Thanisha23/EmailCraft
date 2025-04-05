import {Router} from "express"
import authRouter from "./auth.routes"
import flowchartRouter from "./flowchart.route"
import authMiddleware from "../middleware/authMiddleware"
import emailRouter from "./email.route"
import jobsStatusRouter from "./jobs.route"

const rootRouter = Router({mergeParams: true})

rootRouter.use("/auth",authRouter)
rootRouter.use("/flowchart",authMiddleware,flowchartRouter)
rootRouter.use("/email",authMiddleware,emailRouter)
rootRouter.use("/status",jobsStatusRouter)

export default rootRouter