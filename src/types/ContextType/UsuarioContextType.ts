import type { ErrorResponse } from "../requestType/ErrorResponse";
import type { Response } from "../requestType/Response";
import type { Usuario } from "../requestType/Usuario";
import type { LoginRequest } from "../requestType/LoginRequest";
import type { LoginResponse } from "../requestType/LoginResponse";

export type UsuarioContextType = {
  login: (request: LoginRequest) => Promise<Response<LoginResponse> | ErrorResponse>;
  register: (usuario: Usuario) => Promise<Response<Usuario> | ErrorResponse>;
};
