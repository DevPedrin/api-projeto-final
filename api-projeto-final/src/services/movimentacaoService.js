import pool from "../db/connection.js";
import { AppError } from "../errors/AppError.js";

export async function createMovimentoService({ produto_id, user_id, tipo, quantidade, observacao = null }) {
  try {
    // 1. verificar se produto existe
    const { rows: prodRows } = await pool.query(
      'SELECT estoque_atual FROM produtos WHERE id = $1',
      [produto_id]
    );

    if (prodRows.length === 0) {
      throw new AppError({
        message: "PRODUCT_NOT_FOUND",
        publicMessage: "Produto não encontrado",
        status: 404
      });
    }

    const estoqueAtual = Number(prodRows[0].estoque_atual);

    // 2. aplicar regra de saída
    if (tipo === 'saida' && estoqueAtual < quantidade) {
      throw new AppError({
        message: "STOCK_INSUFFICIENT",
        publicMessage: "Estoque insuficiente para saída",
        status: 400
      });
    }

    // 3. criar movimento
    const insert = await pool.query(
      `INSERT INTO movimentos_estoque (produto_id, user_id, tipo, quantidade, observacao)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [produto_id, user_id, tipo, quantidade, observacao]
    );

    // 4. atualizar estoque do produto
    const novoEstoque = tipo === 'entrada'
      ? estoqueAtual + quantidade
      : estoqueAtual - quantidade;

    await pool.query(
      `UPDATE produtos SET estoque_atual = $1, updated_at = NOW(), updated_by = $2 WHERE id = $3`,
      [novoEstoque, user_id, produto_id]
    );

    return insert.rows[0];

  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao registrar movimentação",
      status: 500,
      data: error
    });
  }
}

export async function getConsumoMensalService() {
  try {
    const query = `
      SELECT
        to_char(created_at, 'YYYY-MM') AS mes,
        SUM(CASE WHEN tipo = 'entrada' THEN quantidade ELSE 0 END) AS entradas,
        SUM(CASE WHEN tipo = 'saida' THEN quantidade ELSE 0 END) AS saidas
      FROM movimentos_estoque
      GROUP BY mes
      ORDER BY mes;
    `;

    const result = await pool.query(query);
    return result.rows;

  } catch(error) {
    console.log(`Error -> ${error}`)
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar consumo mensal",
      status: 500,
      data: error
    });
  }
}

export async function getAllMovimentacoesService() {
  try {
    const query = `
  SELECT
    m.id,
    m.tipo,
    m.quantidade,
    m.observacao,
    m.created_at,
    u.first_name || ' ' || u.last_name AS usuario,
    p.nome AS produto
  FROM movimentos_estoque m
  JOIN users u ON u.id = m.user_id
  JOIN produtos p ON p.id = m.produto_id
  ORDER BY m.created_at DESC;
`;

    const result = await pool.query(query);
    return result.rows;

  } catch(error) {
    console.log(`Error -> ${error}`)
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar movimentações",
      status: 500,
      data: error
    });
  }
}

export async function getMovimentacoesByProdutoService(userId, produtoId) {
  try {
    const query = `
      SELECT 
        m.id,
        m.tipo,
        m.quantidade,
        m.created_at,
        u.first_name || ' ' || u.last_name AS usuario
      FROM movimentos_estoque m
      JOIN users u ON u.id = m.user_id
      WHERE m.produto_id = $1
      ORDER BY m.created_at DESC
    `;

    const result = await pool.query(query, [produtoId]);
    return result.rows;

  } catch(error) {
    console.log("Error ->", error);

    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro ao buscar movimentações",
      status: 500,
      code: "DB_QUERY_FAILED",
      data: error
    });
  }
}