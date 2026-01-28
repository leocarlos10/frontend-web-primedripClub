import type { ErrorResponse } from "../requestType/ErrorResponse";
import type { Response } from "../requestType/Response";
import type { Usuario } from "../requestType/Usuario"

export type UsuarioContextType = {
   login : (usuario:Usuario) => Promise<Response<Usuario> | ErrorResponse>;
   register: (usuario:Usuario) => Promise<Response<Usuario> | ErrorResponse>; 
}