import type { LoginResponse } from "../../types/requestType/usuario/LoginResponse";
import { setSecureSessionItem } from "../cryptoUtils";
import { user_key_storage } from "../../Config";

/**
 * Guarda la información de login del usuario en sessionStorage de forma segura.
 * @param info - Objeto con la información de login del usuario.
 * ejecuta una funcion que viene de cryptoUtils para guardar de forma segura
 * la informacion de inicio de sesion del usuario
 * @param user_key_storage - clave para almacenar la informacion del usuario en sessionStorage, definida en Config.ts
 * @param info - objeto con la informacion de login del usuario, debe cumplir con la estructura de LoginResponse
 * @returns void
 */
export const SaveinfoLogin = (info: LoginResponse) => {
  setSecureSessionItem(user_key_storage, info);
};
