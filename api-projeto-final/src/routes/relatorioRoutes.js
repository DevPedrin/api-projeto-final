import { Router } from "express";
import { gerarRelatorioMensalController } from "../controllers/relatorioController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get('/mensal', authMiddleware, gerarRelatorioMensalController);

export default router;