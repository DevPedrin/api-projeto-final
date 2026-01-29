import {httpRequest} from "./api.js";
import {handleError} from "./handleError.js";

const token = localStorage.getItem("authToken");

export async function getProductById(id) {
  const res = await httpRequest(`/products/${id}`, {
    token: token
  });

  return handleError(res);
}


// Função para pegar todos os produtos
export async function getAllProducts() {
    const res = await httpRequest("/products", {
        token: token
    });

    return handleError(res);
}

// Função para criar um novo produto
export async function createProduct(data) {
    const res = await httpRequest("/products", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        token: token,
        body: data
    });


    return handleError(res);
}

// Função para atualizar um produto
export async function updateProduct(id, data) {
    const res = await httpRequest(`/products/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: data
    });

    return handleError(res);
}

// Função para deletar um produto
export async function deleteProduct(id) {
    const res = await httpRequest(`/products/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return handleError(res);
}
