import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.js";
import {loginController, changePasswordController, resetPasswordController} from "../controllers/authController.js";

const router = Router();


router.post('/login', loginController);

router.post('/change-password',  changePasswordController)

router.post("/reset-password", authMiddleware, resetPasswordController);


export default router;