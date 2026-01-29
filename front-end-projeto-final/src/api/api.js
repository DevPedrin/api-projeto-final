const API_URL = `${window.APP_CONFIG.API_URL}/api`;

export async function httpRequest(endpoint, {
  method = "GET",
  headers = {},
  body = null,
  token = null
} = {}) {

  const url = API_URL + endpoint;
  

  const options = {
    method,
    headers: { ...headers }
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body !== null) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const json = await res.json().catch(() => ({}));

    return {
      httpStatus: res.status,
      success: json.success ?? res.ok,
      status: json.status ?? res.status,
      message: json.message ?? null,
      code: json.error?.code ?? null,
      data: json.data ?? null
    };

  } catch (err) {
    return {
      httpStatus: null,
      success: false,
      status: null,
      message: "Falha ao conectar com o servidor",
      code: "NETWORK_ERROR",
      data: null
    };
  }
}
