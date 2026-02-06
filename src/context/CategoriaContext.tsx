import { createContext, type ReactNode } from "react";
import type { CategoriaContextType } from "../types/ContextType/CategoriaContextType";
import { ApiRequest, getHeaders } from "../utils";
import type { CategoriaResponse } from "../types/requestType/categoria/CategoriaResponse";
import type { CategoriaRequest } from "../types/requestType/categoria/CategoriaRequest";
import { url_backend } from "../Config";

const CategoriaContext = createContext<CategoriaContextType | undefined>(
  undefined,
);

function CategoriaProvider({ children }: { children: ReactNode }) {
  const obtenerCategorias = async () => {
    const respuesta = await ApiRequest<CategoriaResponse[], null>(
      `${url_backend}/categorias`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    return respuesta;
  };

  const obtenerCategoriaPorId = async (id: number) => {
    const respuesta = await ApiRequest<CategoriaResponse, null>(
      `${url_backend}/categorias/${id}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    return respuesta;
  };

  const crearCategoria = async (categoria: CategoriaRequest) => {
    const respuesta = await ApiRequest<CategoriaResponse, CategoriaRequest>(
      `${url_backend}/categorias`,
      {
        method: "POST",
        headers: getHeaders(),
        body: categoria,
      },
    );

    return respuesta;
  };

  const actualizarCategoria = async (
    id: number,
    categoria: CategoriaRequest,
  ) => {
    const respuesta = await ApiRequest<CategoriaResponse, CategoriaRequest>(
      `${url_backend}/categorias/${id}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: categoria,
      },
    );

    return respuesta;
  };

  const eliminarCategoria = async (id: number) => {
    const respuesta = await ApiRequest<boolean, null>(
      `${url_backend}/categorias/${id}`,
      {
        method: "DELETE",
        headers: getHeaders(),
      },
    );

    return respuesta;
  };

  return (
    <CategoriaContext.Provider
      value={{
        obtenerCategorias,
        obtenerCategoriaPorId,
        crearCategoria,
        actualizarCategoria,
        eliminarCategoria,
      }}
    >
      {children}
    </CategoriaContext.Provider>
  );
}

export { CategoriaContext, CategoriaProvider };
