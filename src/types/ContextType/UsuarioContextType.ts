import type { ErrorResponse } from "../requestType/common/ErrorResponse";
import type { Response } from "../requestType/common/Response";
import type { Usuario } from "../requestType/Usuario";
import type { LoginRequest } from "../requestType/usuario/LoginRequest";
import type { LoginResponse } from "../requestType/usuario/LoginResponse";

export type UsuarioContextType = {
  login: (
    request: LoginRequest,
  ) => Promise<Response<LoginResponse> | ErrorResponse>;
  register: (usuario: Usuario) => Promise<Response<Usuario> | ErrorResponse>;
};
