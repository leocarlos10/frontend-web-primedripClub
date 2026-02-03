import { useContext } from "react";
import { ProductoContext } from "../context/Producto.Context";

/**
 * Hook personalizado para acceder al contexto de productos
 * @throws Error si se usa fuera de ProductoProvider
 */
export function useProducto() {
  const context = useContext(ProductoContext);

  if (!context) {
    throw new Error("useProducto debe ser usado dentro de ProductoProvider");
  }

  return context;
}
