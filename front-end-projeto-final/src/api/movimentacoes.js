import { httpRequest } from "./api.js";
import { handleError } from "./handleError.js";

const token = localStorage.getItem("authToken");

// 1) criar movimentação (entrada / saída / ajuste)
export async function createMovimentacao(body) {
  const res = await httpRequest(`/movimentacao`, {
    method: "POST",
    body,
    token
  });

  return handleError(res);
}

// 2) historico por produto
export async function getMovimentacoesByProduto(produtoId) {
  const res = await httpRequest(`/movimentacao/produto/${produtoId}`, {
    token
  });

  return handleError(res);
}

export async function getAllMovimentacoes() {
  const res = await httpRequest(`/movimentacao/`, {
    token
  });

  return handleError(res);
}

// 3) dados para dashboard (consumo mensal)
export async function getConsumoMensal() {
  const res = await httpRequest(`/movimentacao/consumo-mensal`, {
    token
  });

  return handleError(res);
}
