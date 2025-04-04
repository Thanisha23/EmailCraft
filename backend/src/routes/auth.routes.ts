import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import authMiddleware from '../middleware/authMiddleware';

const authRouter = Router({mergeParams: true});

authRouter.post("/register", register)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.get("/status", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Authenticated",
        authenticated: true
    });
});
export default authRouter
