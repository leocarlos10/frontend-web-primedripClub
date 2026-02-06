import type { Response } from "../../types/requestType/common/Response";
import type { ProductoResponse } from "../../types/requestType/producto/ProductoResponse";
import type { ErrorResponse } from "../../types/requestType/common/ErrorResponse";

export interface CargarProductosParams {
  obtenerProductos: () => Promise<Response<ProductoResponse[]> | ErrorResponse>;
  setProducts: React.Dispatch<React.SetStateAction<ProductoResponse[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export const cargarProductos = async ({
  obtenerProductos,
  setProducts,
  setIsLoading,
  setError,
  showToast,
}: CargarProductosParams): Promise<void> => {
  try {
    setIsLoading(true);
    setError(false);
    const respuesta = await obtenerProductos();

    if (respuesta.success) {
      setProducts((respuesta as Response<ProductoResponse[]>).data);
    } else {
      setError(true);
      showToast("Error al cargar productos", "error");
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
    setError(true);
    showToast("Error al cargar productos", "error");
  } finally {
    setIsLoading(false);
  }
};
