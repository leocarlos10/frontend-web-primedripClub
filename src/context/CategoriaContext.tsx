import { createContext, type ReactNode } from "react";
import type { CategoriaContextType } from "../types/ContextType/CategoriaContextType";
import { ApiRequest } from "../utils/ApiRequest";
import type { CategoriaResponse } from "../types/requestType/categoria/CategoriaResponse";
import {url_backend} from "../Config";
import { getAuthHeaders } from "../utils/Headers";
import { useAuth } from "../hooks/useAuth";

const CategoriaContext = createContext<CategoriaContextType | undefined>(
  undefined,
);

function CategoriaProvider({ children }: { children: ReactNode }) {

     const { user, isAuthenticated } = useAuth(); 
  const obtenerCategorias = async () => {
    if (!isAuthenticated || !user) {
      throw new Error("Usuario no autenticado");
    }

    const respuesta = await ApiRequest<CategoriaResponse[], null>(
      `${url_backend}/categorias`,
      {
        method: "GET",
        headers: getAuthHeaders(user.token),
      },
    );

    return respuesta;
  };

  return (
    <CategoriaContext.Provider value={{ obtenerCategorias }}>
      {children}
    </CategoriaContext.Provider>
  );
}

export { CategoriaContext, CategoriaProvider };
