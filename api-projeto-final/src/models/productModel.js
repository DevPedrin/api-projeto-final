import pool from "../db/connection.js";
import { AppError } from "../errors/AppError.js";

export async function findAllProducts() {
  try {
    const query = `SELECT * FROM produtos ORDER BY id ASC`;
    const { rows } = await pool.query(query);
    return rows;
  } catch(error) {
    throw new AppError({
      message: "DB_ERROR_FIND_ALL_PRODUCTS",
      publicMessage: "Erro ao buscar produtos.",
      status: 500,
      code: "DB_ERROR",
      data: { error }
    });
  }
}

export async function findProductById(id) {
  try {
    const query = `SELECT * FROM produtos WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_ERROR_FIND_PRODUCT_BY_ID",
      publicMessage: "Erro ao buscar produto.",
      status: 500,
      code: "DB_ERROR",
      data: { error }
    });
  }
}

export async function createProduct(data, currentUserId) {
  try {
    const query = `
      INSERT INTO produtos (
        nome,
        descricao,
        unidade_medida,
        estoque_atual,
        fila,
        prateleira,
        preco,
        ativo,
        fabricante_nome,
        fornecedor_nome,
        created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;

    const values = [
      data.nome,
      data.descricao,
      data.unidade_medida,
      data.estoque_atual ?? 0,
      data.fila,
      data.prateleira,
      data.preco,
      data.ativo ?? true,
      data.fabricante_nome,
      data.fornecedor_nome,
      currentUserId
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_ERROR_CREATE_PRODUCT",
      publicMessage: "Erro ao criar produto.",
      status: 500,
      code: "DB_ERROR",
      data: { error }
    });
  }
}

export async function updateProduct(id, data, currentUserId) {
  try {
    const query = `
      UPDATE produtos SET
        nome = $1,
        descricao = $2,
        unidade_medida = $3,
        estoque_atual = $4,
        fila = $5,
        prateleira = $6,
        preco = $7,
        ativo = $8,
        fabricante_nome = $9,
        fornecedor_nome = $10,
        updated_by = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `;

    const values = [
      data.nome,
      data.descricao,
      data.unidade_medida,
      data.estoque_atual,
      data.fila,
      data.prateleira,
      data.preco,
      data.ativo,
      data.fabricante_nome,
      data.fornecedor_nome,
      currentUserId,
      id
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch(error) {
    throw new AppError({
      message: "DB_ERROR_UPDATE_PRODUCT",
      publicMessage: "Erro ao atualizar produto.",
      status: 500,
      code: "DB_ERROR",
      data: { error }
    });
  }
}

export async function deleteProduct(id) {
  try {
    const query = `DELETE FROM produtos WHERE id = $1 RETURNING id`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch(error) {
    if(error?.code === "23503") {
      throw new AppError({
        message: "PRODUCT_IN_USE",
        publicMessage: "Este produto possui movimentos de estoque e não pode ser excluído.",
        status: 409,
        code: "CONFLICT"
      });
    }
    console.log(error)
    throw new AppError({
      message: "DB_ERROR_DELETE_PRODUCT",
      publicMessage: "Erro ao remover produto.",
      status: 500,
      code: "DB_ERROR",
      data: { error }
    });
  }
}