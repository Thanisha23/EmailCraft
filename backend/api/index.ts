import express,{Request,Response} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import env from "../src/utils/validateEnv"
import rootRouter from "../src/routes"
import "../src/db"
const app = express()

app.use(cors(
    {
        origin: env.FRONTEND_URL,
        credentials: true,
    }
))

app.use(cookieParser())

app.use(express.json())

app.get("/",(req:Request,res: Response) => {
    res.send("Backend is running")
})

app.use("/api/v1",rootRouter)

app.listen(env.PORT,() => {
    console.log("The application is running on port http://localhost: "+ env.PORT)
})