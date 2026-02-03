import { createContext, type ReactNode } from "react";
import type { ProductoContextType } from "../types/ContextType/ProductoContextType";
import { ApiRequest } from "../utils/ApiRequest";
import type { ProductoResponse } from "../types/requestType/producto/ProductoResponse";
import type { ProductoRequest } from "../types/requestType/producto/ProductoRequest";
import {url_backend} from "../Config";
import { getAuthHeaders } from "../utils/Headers";
import { useAuth } from "../hooks/useAuth";

const ProductoContext = createContext<ProductoContextType | undefined>(
  undefined,
);

function ProductoProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const guardarProducto = async (producto: ProductoRequest) => {
    if (!isAuthenticated || !user) {
      throw new Error("Usuario no autenticado");
    }

    const respuesta = await ApiRequest<ProductoResponse, ProductoRequest>(
      `${url_backend}/productos`,
      {
        method: "POST",
        headers: getAuthHeaders(user.token),
        body: producto,
      },
    );

    return respuesta;
  };

  const obtenerProductos = async () => {
    if (!isAuthenticated || !user) {
      throw new Error("Usuario no autenticado");
    }
    const respuesta = await ApiRequest<ProductoResponse[], null>(
      `${url_backend}/productos`,
      {
        method: "GET",
        headers: getAuthHeaders(user.token),
      },
    );

    return respuesta;
  };

  return (
    <ProductoContext.Provider value={{ guardarProducto, obtenerProductos }}>
      {children}
    </ProductoContext.Provider>
  );
}

export { ProductoContext, ProductoProvider };
