import pool from "../db/connection.js";
import { AppError } from "../errors/AppError.js";

export async function getDashboardDataService() {
  // total usuários
  const totalUsuariosQuery = `
    SELECT COUNT(*)::int AS total
    FROM users
    WHERE active = TRUE;
  `;

  // total produtos
  const totalProdutosQuery = `
    SELECT COUNT(*)::int AS total
    FROM produtos
    WHERE ativo = TRUE;
  `;

  // movimentos do mês atual
  const movimentosMesQuery = `
    SELECT 
      SUM(CASE WHEN tipo = 'entrada' THEN quantidade ELSE 0 END)::numeric AS entradas,
      SUM(CASE WHEN tipo = 'saida' THEN quantidade ELSE 0 END)::numeric AS saidas
    FROM movimentos_estoque
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
  `;

  const client = await pool.connect();

  try {
    const [u, p, m] = await Promise.all([
      client.query(totalUsuariosQuery),
      client.query(totalProdutosQuery),
      client.query(movimentosMesQuery)
    ]);

    return {
      totalUsuarios: u.rows[0]?.total ?? 0,
      totalProdutos: p.rows[0]?.total ?? 0,
      movimentosMes: {
        entradas: Number(m.rows[0]?.entradas ?? 0),
        saidas: Number(m.rows[0]?.saidas ?? 0)
      }
    };

  } catch (error) {
    throw new AppError({
      message: "DB_QUERY_FAILED",
      publicMessage: "Erro",
      status: 500,
      data: error
    });
  } finally {
    client.release();
  }
}