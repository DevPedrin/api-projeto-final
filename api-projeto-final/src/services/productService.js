import { AppError } from "../errors/AppError.js";
import { getUserPermissions } from "../models/userModel.js";
import {
  findAllProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../models/productModel.js";

export async function getAllProductsService(currentUserId) {
  try {
    const perms = await getUserPermissions(currentUserId);
    if(!perms.some(p => p.key === "view_produto")) {
      throw new AppError({
        message: "UNAUTHORIZED_VIEW_PRODUCT",
        publicMessage: "Usuário não autorizado.",
        status: 401,
        code: "UNAUTHORIZED"
      });
    }

    return await findAllProducts();
  } catch(error) {
    if(error instanceof AppError) {
      throw error;
    }

    throw new AppError({
      message: `INTERNAL_ERROR_GET_ALL_PRODUCTS: ${error}`,
      publicMessage: "Erro interno ao buscar produtos.",
      status: 500,
      code: "INTERNAL_ERROR",
      data: { error }
    });
  }
}

export async function getProductService(currentUserId, id) {
  try {
    const perms = await getUserPermissions(currentUserId);
    if(!perms.some(p => p.key === "view_produto")) {
      throw new AppError({
        message: "UNAUTHORIZED_VIEW_PRODUCT",
        publicMessage: "Usuário não autorizado.",
        status: 401,
        code: "UNAUTHORIZED"
      });
    }

    const product = await findProductById(id);
    if(!product) {
      throw new AppError({
        message: "PRODUCT_NOT_FOUND",
        publicMessage: "Produto não encontrado.",
        status: 404,
        code: "NOT_FOUND"
      });
    }

    return product;
  } catch(error) {
    if(error instanceof AppError) {
      throw error;
    }
    
    throw new AppError({
      message: `INTERNAL_ERROR_GET_PRODUCT: ${error}`,
      publicMessage: "Erro interno ao buscar produto.",
      status: 500,
      code: "INTERNAL_ERROR",
      data: { error }
    });
  }
}

export async function createProductService(currentUserId, data) {
  try {
    const perms = await getUserPermissions(currentUserId);
    if(!perms.some(p => p.key === "create_produto")) {
      throw new AppError({
        message: "UNAUTHORIZED_CREATE_PRODUCT",
        publicMessage: "Usuário não autorizado.",
        status: 401,
        code: "UNAUTHORIZED"
      });
    }

    return await createProduct(data, currentUserId);
  } catch(error) {
      if(error instanceof AppError) {
        throw error;
      }

    throw new AppError({
      message: `INTERNAL_ERROR_CREATE_PRODUCT: ${error}`,
      publicMessage: "Erro interno ao criar produto.",
      status: 500,
      code: "INTERNAL_ERROR",
      data: { error }
    });
  }
}

export async function updateProductService(currentUserId, id, data) {
  try {
    const perms = await getUserPermissions(currentUserId);
    if(!perms.some(p => p.key === "edit_produto")) {
      throw new AppError({
        message: "UNAUTHORIZED_EDIT_PRODUCT",
        publicMessage: "Usuário não autorizado.",
        status: 401,
        code: "UNAUTHORIZED"
      });
    }

    const existing = await findProductById(id);
    if(!existing) {
      throw new AppError({
        message: "PRODUCT_NOT_FOUND",
        publicMessage: "Produto não encontrado.",
        status: 404,
        code: "NOT_FOUND"
      });
    }

    const payload = {
      nome: data.nome ?? existing.nome,
      descricao: data.descricao ?? existing.descricao,
      unidade_medida: data.unidade_medida ?? existing.unidade_medida,
      estoque_atual: data.estoque_atual ?? existing.estoque_atual,
      fila: data.fila ?? existing.fila,
      prateleira: data.prateleira ?? existing.prateleira,
      preco: data.preco ?? existing.preco,
      ativo: data.ativo ?? existing.ativo,
      fabricante_nome: data.fabricante_nome ?? existing.fabricante_nome,
      fornecedor_nome: data.fornecedor_nome ?? existing.fornecedor_nome
    };

    return await updateProduct(id, payload, currentUserId);
  } catch(error) {
    if(error instanceof AppError) {
      throw error;
    }    

    throw new AppError({
      message: `INTERNAL_ERROR_UPDATE_PRODUCT: ${error}`,
      publicMessage: "Erro interno ao atualizar produto.",
      status: 500,
      code: "INTERNAL_ERROR",
      data: { error }
    });
  }
}

export async function deleteProductService(currentUserId, id) {
  try {
    const perms = await getUserPermissions(currentUserId);
    if(!perms.some(p => p.key === "delete_produto")) {
      throw new AppError({
        message: "UNAUTHORIZED_DELETE_PRODUCT",
        publicMessage: "Usuário não autorizado.",
        status: 401,
        code: "UNAUTHORIZED"
      });
    }

    const existing = await findProductById(id);
    if(!existing) {
      throw new AppError({
        message: "PRODUCT_NOT_FOUND",
        publicMessage: "Produto não encontrado.",
        status: 404,
        code: "NOT_FOUND"
      });
    }

    await deleteProduct(id);
    return { success: true };
  } catch(error) {
    if(error instanceof AppError) {
      throw error;
    }

    if(error?.code === "23503") {
      throw new AppError({
        message: "PRODUCT_IN_USE",
        publicMessage: "Este produto possui movimentos de estoque e não pode ser excluído.",
        status: 409,
        code: "CONFLICT"
      });
    }

    throw new AppError({
      message: `INTERNAL_ERROR_DELETE_PRODUCT: ${error}`,
      publicMessage: "Erro interno ao remover produto.",
      status: 500,
      code: "INTERNAL_ERROR",
      data: { error }
    });
  }
}