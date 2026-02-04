import { createContext, type ReactNode } from "react";
import type { ProductoContextType } from "../types/ContextType/ProductoContextType";
import { ApiRequest } from "../utils/ApiRequest";
import type { ProductoResponse } from "../types/requestType/producto/ProductoResponse";
import type { ProductoRequest } from "../types/requestType/producto/ProductoRequest";
import {url_backend} from "../Config";
import { getAuthHeaders, getHeaders } from "../utils/Headers";
import { useAuth } from "../hooks/useAuth";
import type { ProductUpdateData } from "../types/product";

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

  const obtenerProductosActivos = async () => {
    
    const respuesta = await ApiRequest<ProductoResponse[], null>(
      `${url_backend}/productos/activos`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    return respuesta;
  }

  const actualizarProductos = async (producto: ProductUpdateData) => {
    
    if (!isAuthenticated || !user) {
      throw new Error("Usuario no autenticado");
    }

    const respuesta = await ApiRequest<ProductoResponse, ProductUpdateData>(
      (
        `${url_backend}/productos/${producto.id}`
      ),{
        method: "PUT",
        headers: getAuthHeaders(user.token),
        body: producto,
      }
    );

    return respuesta;
   }

   const eliminarProducto = async (id:number) => {
    
    if (!isAuthenticated || !user) {
      throw new Error("Usuario no autenticado");
    }

    const respuesta = await ApiRequest<boolean, null>(
      `${url_backend}/productos/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(user.token),
      },
    );

    return respuesta;
   }

  return (
    <ProductoContext.Provider value={{ guardarProducto, obtenerProductos, actualizarProductos, obtenerProductosActivos, eliminarProducto }}>
      {children}
    </ProductoContext.Provider>
  );
}

export { ProductoContext, ProductoProvider };
