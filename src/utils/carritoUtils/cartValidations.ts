import type { CartItem } from "../../types/cart/CartItem";

export const validateStock = (
  cantidad: number,
  stockDisponible: number,
): { valid: boolean; message?: string } => {
  if (cantidad <= 0) {
    return { valid: false, message: "La cantidad debe ser mayor a 0" };
  }

  if (cantidad > stockDisponible) {
    return {
      valid: false,
      message: `Solo hay ${stockDisponible} unidades disponibles`,
    };
  }

  return { valid: true };
};

export const validateCartItem = (
  item: CartItem,
): { valid: boolean; message?: string } => {
  if (!item.id || !item.nombre || !item.precio) {
    return { valid: false, message: "Datos del producto incompletos" };
  }

  if (item.stock === 0) {
    return { valid: false, message: "Producto agotado" };
  }

  return { valid: true };
};
