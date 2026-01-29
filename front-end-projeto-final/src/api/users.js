import {httpRequest} from "./api.js";
import {handleError} from "./handleError.js";

const token = localStorage.getItem("authToken");

export async function getMe() {
    const res = await httpRequest("/users/me", {
        method: "GET",
        token: token
    });

    return handleError(res);
}

export async function getAllUsers() {
    const res = await httpRequest("/users", {
        token: token
    })

    return handleError(res);
}

export async function createUser(data) {
    const res = await httpRequest("/users", {
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

export async function updateUser(id, data) {
    const res = await httpRequest(`/users/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: data
    });

    return handleError(res);
}

export async function deleteUser(id) {
    const res = await httpRequest(`/users/${id}`, {
        method: "DELETE",
        headers: {"Authorization": `Bearer ${token}` }
    });

    return handleError(res);
}