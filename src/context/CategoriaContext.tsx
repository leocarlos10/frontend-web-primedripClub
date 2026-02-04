import { createContext, type ReactNode } from "react";
import type { CategoriaContextType } from "../types/ContextType/CategoriaContextType";
import { ApiRequest } from "../utils/ApiRequest";
import type { CategoriaResponse } from "../types/requestType/categoria/CategoriaResponse";
import { url_backend } from "../Config";
import { getHeaders } from "../utils/Headers";

const CategoriaContext = createContext<CategoriaContextType | undefined>(
  undefined,
);

function CategoriaProvider({ children }: { children: ReactNode }) {

  const obtenerCategorias = async () => {
    const respuesta = await ApiRequest<CategoriaResponse[], null>(
      `${url_backend}/categorias`,
      {
        method: "GET",
        headers: getHeaders()
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
