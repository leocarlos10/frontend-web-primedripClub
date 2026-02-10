import { useContext } from "react";
import { CarritoContext } from "../context/Carrito.Context";
import type { CarritoContextType } from "../types/ContextType/CarritoContextType";

export const useCarrito = (): CarritoContextType => {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }

  return context;
};
