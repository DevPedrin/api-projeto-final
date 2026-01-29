import { createMovimentoService, getConsumoMensalService, getMovimentacoesByProdutoService, getAllMovimentacoesService } from '../services/movimentacaoService.js';

export async function getAllMovimentacoesController(req, res, next) {
  try {
    const data = await getAllMovimentacoesService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getConsumoMensalController(req, res, next) {
  try {
    const data = await getConsumoMensalService();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}


export async function createMovimentoController(req, res, next) {
  try {
    const result = await createMovimentoService({
      ...req.body,
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch(error) {
    next(error);
  }
}


export async function getMovimentacoesByProdutoController(req, res, next) {
  try {
    const produtoId = Number(req.params.id);
    const userId = req.user.id;

    const data = await getMovimentacoesByProdutoService(userId, produtoId);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
}