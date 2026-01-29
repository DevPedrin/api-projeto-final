import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.js";
import {createMovimentoController, getAllMovimentacoesController, getConsumoMensalController,getMovimentacoesByProdutoController} from '../controllers/movimentacaoController.js';

const router = Router();

// Retorna todas as movimetações
router.get('/', authMiddleware, getAllMovimentacoesController)

// cria uma movimentação
router.post('/', authMiddleware, createMovimentoController);

// Retorna todas as movimetações mesnsal
router.get('/consumo-mensal', authMiddleware, getConsumoMensalController);

// Retorna todas as movimetações por um produto
router.get("/produto/:id", authMiddleware, getMovimentacoesByProdutoController);

export default router;