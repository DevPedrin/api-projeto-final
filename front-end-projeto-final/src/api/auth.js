import {httpRequest} from "./api.js";

export async function login(username, password) {
  try {
    
    const res = await httpRequest("/auth/login", {
      method: "POST",
      body: {
        matricula: username,
        password: password
      }
    });

    if(res.status === 403 && res.code === "PASSWORD_CHANGE_REQUIRED") {
      alert("Primeiro acesso! precisa trocar a senha.");
      window.location.href = "./src/pages/alterar-senha.html";
      return;
    }

    
    if(res.code == "INVALID_CREDENTIALS") {
      alert("Usuário ou senha inválidos.");
      return;
    }

    const token = res.data.token;
    if (!token) {
      alert("Token não recebido do servidor.");
      return;
    }

    
    localStorage.setItem("authToken", token);
    window.location.href = "./src/pages/dashboard.html";
    

    

  } catch (error) {
    alert("Erro:", error);
    alert("Erro de conexão");
  }
}

export async function changePassword(matricula, old_password, new_password) {
  try {
    const res = await httpRequest("/auth/change-password", {
      method: "POST",
      body: {
        matricula,
        old_password,
        new_password
      }
    });

    if(res.ok) {
      alert("Senha alterada com sucesso! Faça login.");
      window.location.href = "./index.html";
    }
    
  } catch(err) {
    console.error(err);
    alert("Erro de conexão com servidor.");
  }
}

export async function resetPassword(matricula) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await httpRequest("/auth/reset-password", {
      method: "POST",
      token,
      body: { matricula }
    });


    alert(`Senha resetada com sucesso! Nova senha temporária: ${res.data?.temporary_password}`);

  } catch (error) {
    console.error(error);
    alert("Erro de conexão com servidor");
  }
}
