import { createContext, type ReactNode } from "react";
import { ApiRequest } from "../utils/ApiRequest";
import url_backend from "../Config";
import { getHeaders } from "../utils/Headers";
import type { Usuario } from "../types/requestType/Usuario";
import type { UsuarioContextType } from "../types/ContextType/UsuarioContextType";

const UsuarioContext = createContext<UsuarioContextType | null>(null);

function UsuarioProvider({ children }: { children: ReactNode }) {
  const login = async (usuario: Usuario) => {
      const respueta = await ApiRequest<Usuario, Usuario>(
        `${url_backend}/auth/login`,
        {
          method: "POST",
          headers: getHeaders(),
          body: usuario,
        },
      );

    return respueta;

  };

  const register = async (usuario: Usuario) => {
      const respueta = await ApiRequest<Usuario, Usuario>(`${url_backend}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: usuario,
    });

    return respueta;

  };

  return (
    <UsuarioContext.Provider value={{ login, register }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export { UsuarioContext, UsuarioProvider };
