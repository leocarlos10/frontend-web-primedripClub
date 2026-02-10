import type { CartItem } from "../../types/cart/CartItem";

export const calculateItemTotal = (item: CartItem): number => {
  return item.precio * item.cantidad;
};

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
};

export const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.cantidad, 0);
};
