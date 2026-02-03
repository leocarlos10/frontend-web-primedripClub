import { useContext } from "react";
import { CategoriaContext } from "../context/CategoriaContext";

/**
 * Hook personalizado para acceder al contexto de categorías
 * @throws Error si se usa fuera de CategoriaProvider
 */
export function useCategoria() {
  const context = useContext(CategoriaContext);

  if (!context) {
    throw new Error("useCategoria debe ser usado dentro de CategoriaProvider");
  }

  return context;
}
