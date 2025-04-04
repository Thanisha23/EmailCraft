import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

interface AuthRequest extends Request {
    userId?: string
}

const authMiddleware = (req:AuthRequest,res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
        if(!token) {
            res.status(401).json({
                message: "Unauthorized: No token provided"
            })
            return
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {userId : string}
        req.userId = decoded.userId

        next()

    } catch (error) {
        res.status(401).json({
            message: "Unauthorized: Invalid token"
        })
    }
}

export default authMiddleware