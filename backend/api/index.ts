import express,{Request,Response} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import env from "../src/utils/validateEnv"
import rootRouter from "../src/routes"
// import "../src/db"
import connectDB from "../src/db"
const app = express()

app.use(cors(
    {
        origin: ['https://emailcraft.thanisha.tech', 'http://localhost:3000'],
        credentials: true,
    }
))

app.use(cookieParser())

app.use(express.json())

app.get("/",(req:Request,res: Response) => {
    res.send("Backend is running")
})

app.use("/api/v1",rootRouter)

const startServer = async () => {
    await connectDB();
  
    const PORT = env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT} `);
    });
  };
  
  startServer();