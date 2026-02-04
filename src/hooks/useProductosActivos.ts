import { useState, useEffect } from "react";
import { useProducto } from "./useProducto";
import type { ProductoResponse } from "../types/requestType/producto/ProductoResponse";
import type { Response } from "../types/requestType/common/Response";

export const useProductosActivos = () => {
  const [productos, setProductos] = useState<ProductoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { obtenerProductosActivos } = useProducto();

  const cargarProductos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const respuesta = await obtenerProductosActivos();

      if (respuesta.success) {
        setProductos((respuesta as Response<ProductoResponse[]>).data);
      } else {
        setError("No se pudieron cargar los productos");
      }
    } catch (err) {
      setError("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return {
    productos,
    isLoading,
    error,
    refetch: cargarProductos,
  };
};
