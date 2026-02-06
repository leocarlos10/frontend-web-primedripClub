import type { Response } from "../../types/requestType/common/Response";
import type { CategoriaResponse } from "../../types/requestType/categoria/CategoriaResponse";
import type { ErrorResponse } from "../../types/requestType/common/ErrorResponse";

export interface CargarCategoriasParams {
  obtenerCategorias: () => Promise<
    Response<CategoriaResponse[]> | ErrorResponse
  >;
  setCategories: React.Dispatch<React.SetStateAction<CategoriaResponse[]>>;
  setIsCategoryLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryError: React.Dispatch<React.SetStateAction<boolean>>;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export const cargarCategorias = async ({
  obtenerCategorias,
  setCategories,
  setIsCategoryLoading,
  setCategoryError,
  showToast,
}: CargarCategoriasParams): Promise<void> => {
  try {
    setIsCategoryLoading(true);
    setCategoryError(false);
    const respuesta = await obtenerCategorias();

    if (respuesta.success) {
      setCategories((respuesta as Response<CategoriaResponse[]>).data);
    } else {
      setCategoryError(true);
      showToast("Error al cargar categorías", "error");
    }
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    setCategoryError(true);
    showToast("Error al cargar categorías", "error");
  } finally {
    setIsCategoryLoading(false);
  }
};
