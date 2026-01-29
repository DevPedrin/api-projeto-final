export function handleError(res) {
  if (res.success) {
    return {
      ok: true,
      status: res.status,
      data: res.data,
      message: null,
      code: null };
  }

  

  switch (res.code) {
    case "TOKEN_EXPIRED":
    case "INVALID_TOKEN":
      alert(res.message || "Sessão expirada.");
      localStorage.removeItem("authToken");
      window.location.href = "/pages/login.html";
      return {ok: false, status: 400, message: "TOKEN_EXPIRED"};

    case "UNAUTHORIZED":
      alert("Você não tem permissão.");
      return {ok: false, status: 401, message: "UNAUTHORIZED"};
    
    case "FORBIDDEN":
      return {ok: false, status: 401, message: "UNAUTHORIZED"};

    case "INVALID_CREDENTIALS":
      alert("Usuário ou senha inválidos.")
      return {ok: false, status: 401, message: "UNAUTHORIZED"};

    default:
      alert(res.message || "Erro inesperado.");
      return {ok: false, status: 500, message: "Erro inesperado."};
  }
}