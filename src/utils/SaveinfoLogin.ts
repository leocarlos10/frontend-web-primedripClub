import type { LoginResponse } from "../types/requestType/usuario/LoginResponse";

export const SaveinfoLogin = (info: LoginResponse) => {
  sessionStorage.setItem("info", JSON.stringify(info));
};
