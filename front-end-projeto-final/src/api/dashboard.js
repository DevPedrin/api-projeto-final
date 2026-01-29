import {httpRequest} from "./api.js";
import {handleError} from "./handleError.js";

export async function getDashboardData() {
  const token = localStorage.getItem("authToken");

  const res = await httpRequest("/dashboard", {
    method: "GET",
    token
  });

  return handleError(res);
}
