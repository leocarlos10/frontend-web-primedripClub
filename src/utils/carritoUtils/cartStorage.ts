import type { CartItem } from "../../types/cart/CartItem";
import { cart_storage_key } from "../../Config";
import { setSecureItem, getSecureItem, removeSecureItem } from "../cryptoUtils";


export const getCartFromStorage = (): CartItem[] => {
  try {
    const cartData = getSecureItem<CartItem[]>(cart_storage_key);
    return cartData || [];
  } catch (error) {
    console.error("Error al leer carrito desde localStorage:", error);
    return [];
  }
};

export const saveCartToStorage = (items: CartItem[]): void => {
  try {
    setSecureItem(cart_storage_key, items);
  } catch (error) {
    console.error("Error al guardar carrito en localStorage:", error);
  }
};

export const clearCartStorage = (): void => {
  try {
    removeSecureItem(cart_storage_key);
  } catch (error) {
    console.error("Error al limpiar carrito de localStorage:", error);
  }
};
