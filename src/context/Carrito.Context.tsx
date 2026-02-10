import { createContext, useState, useEffect, type ReactNode } from "react";
import type { CarritoContextType } from "../types/ContextType/CarritoContextType";
import type { CartItem } from "../types/cart/CartItem";
import type { CatalogProduct } from "../types/product";
import { useToast } from "../hooks/useToast";
import {
  getCartFromStorage,
  saveCartToStorage,
  clearCartStorage,
  validateStock,
  calculateCartTotal,
  calculateItemCount,
} from "../utils/carritoUtils";

export const CarritoContext = createContext<CarritoContextType | null>(null);

interface CarritoProviderProps {
  children: ReactNode;
}

export const CarritoProvider = ({ children }: CarritoProviderProps) => {
  // Cargar carrito DIRECTAMENTE desde localStorage en el estado inicial
  const [items, setItems] = useState<CartItem[]>(() => {
    const cartItems = getCartFromStorage();
    return cartItems;
  });
  const { showToast } = useToast();

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const agregarAlCarrito = (product: CatalogProduct, cantidad: number) => {
    // Validar stock
    const stockValidation = validateStock(cantidad, product.stock);
    if (!stockValidation.valid) {
      showToast(stockValidation.message || "Error de validación", "error");
      return;
    }

    const existingItem = items.find((item) => item.id === product.id);

    setItems((prevItems) => {
      if (existingItem) {
        // Si ya existe, incrementar cantidad
        const newCantidad = existingItem.cantidad + cantidad;

        // Validar nuevo stock
        const newStockValidation = validateStock(newCantidad, product.stock);
        if (!newStockValidation.valid) {
          showToast(
            newStockValidation.message || "Error de validación",
            "error",
          );
          return prevItems;
        }

        return prevItems.map((item) =>
          item.id === product.id ? { ...item, cantidad: newCantidad } : item,
        );
      } else {
        // Agregar nuevo producto
        const newItem: CartItem = {
          id: product.id,
          nombre: product.nombre,
          marca: product.marca,
          imagenUrl: product.imagenUrl,
          precio: product.precio,
          cantidad: cantidad,
          stock: product.stock,
          categoriaId: product.categoriaId,
        };

        return [...prevItems, newItem];
      }
    });

    // Toast fuera del setItems para evitar duplicados
    if (existingItem) {
      showToast(`${cantidad} unidad(es) más agregadas al carrito`, "success");
    } else {
      showToast(`Producto agregado al carrito`, "success");
    }
  };

  const eliminarDelCarrito = (productId: number) => {
    let newItems;
    setItems((prevItems) => {
      newItems = prevItems.filter((item) => item.id !== productId);
      return newItems;
    });

    showToast("Producto eliminado del carrito", "info");
  };

  const actualizarCantidad = (productId: number, cantidad: number) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === productId);
      if (!item) return prevItems;

      // Validar stock
      const stockValidation = validateStock(cantidad, item.stock);
      if (!stockValidation.valid) {
        showToast(stockValidation.message || "Error de validación", "error");
        return prevItems;
      }

      return prevItems.map((i) =>
        i.id === productId ? { ...i, cantidad } : i,
      );
    });
  };

  const vaciarCarrito = () => {
    setItems([]);
    clearCartStorage();
    showToast("Carrito vaciado", "info");
  };

  const obtenerTotal = (): number => {
    return calculateCartTotal(items);
  };

  const obtenerCantidadTotal = (): number => {
    return calculateItemCount(items);
  };

  const value: CarritoContextType = {
    items,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    obtenerTotal,
    obtenerCantidadTotal,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
};
