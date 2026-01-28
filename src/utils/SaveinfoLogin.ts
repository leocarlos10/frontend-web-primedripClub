import type { LoginResponse } from "../types/requestType/LoginResponse";

export const SaveinfoLogin = (info:LoginResponse) => {
    sessionStorage.setItem("info", JSON.stringify(info));
}