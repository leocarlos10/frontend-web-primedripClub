import type { CartItem } from "../../types/cart/CartItem";
import { cart_storage_key, session_key_storage} from "../../Config";
import { setSecureItem, getSecureItem, removeSecureItem } from "../cryptoUtils";
import type { CartSession } from "../../types/requestType/Carrito/cartSession";


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

/*
funcion para guardar una sesion del carrito en el localStorage 
 */
export const saveCartSessionToStorage = (cartSession: CartSession): void => {
  try {
    setSecureItem(session_key_storage, cartSession);
  } catch (error) {
    console.error("Error al guardar cartSession en localStorage:", error);
  }
}

/* funcion para recuperar una sesion del carrito desde el localStorage */
export const getCartSessionFromStorage = (): CartSession | null => {
  try {
    const cartSession = getSecureItem<CartSession>(session_key_storage);
    return cartSession || null;
  } catch (error) {
    console.error("Error al leer cartSession desde localStorage:", error);
    return null;
  }
}

/* funcion para eliminar una sesion del carrito */
export const clearCartSessionStorage = (): void => {
  try {
    removeSecureItem(session_key_storage);
  } catch (error) {
    console.error("Error al limpiar cartSession de localStorage:", error);
  }
}
