import { createContext, useState, useEffect, type ReactNode, cache } from "react";
import type { CarritoContextType } from "../types/ContextType/CarritoContextType";
import type { CartItem } from "../types/cart/CartItem";
import type { CartSession } from "../types/requestType/Carrito/cartSession";
import type { CatalogProduct } from "../types/product";
import type { DetalleCarritoRequest } from "../types/requestType/Carrito/DetalleCarritoRequest";
import type { ActualizarDetalleCarrito } from "../types/requestType/Carrito/ActualizarDetalleCarrito";
import type { EliminarDetalleCarrito } from "../types/requestType/Carrito/EliminarDetalleCarrito";
import { useToast } from "../hooks/useToast";
import {
  getCartFromStorage,
  saveCartToStorage,
  clearCartStorage,
  validateStock,
  calculateCartTotal,
  calculateItemCount,
  getCartSessionFromStorage,
  saveCartSessionToStorage,
  /* clearCartSessionStorage */
} from "../utils/carritoUtils";
import { carritoService } from "../utils/carritoUtils/cartApi";
import { useAuth } from "../hooks/useAuth";
import type { DetalleCarritoResponse } from "../types/requestType/Carrito/DetalleCarritoResponse";

export const CarritoContext = createContext<CarritoContextType | null>(null);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartSession, setCartSession] = useState<CartSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const { showToast } = useToast();

  const { user } = useAuth();

  // Inicializar carrito al montar el componente
  useEffect(() => {
    initializeCart();
  }, []);

  // Guardar en localStorage cuando cambie (solo como cache)
  useEffect(() => {
    if (!isLoading) {
      if (items.length > 0) {
        saveCartToStorage(items);
      } else {
        clearCartStorage();
      }
    }
  }, [items, isLoading]);

  /**
   * Inicializa el carrito desde localStorage (cache) y backend
   * Estrategia: Cargar rápido desde cache, luego sincronizar con backend
   */
  const initializeCart = async () => {
    try {
      setIsLoading(true);

      // leer cache
      const cachedItems = getCartFromStorage();
      const cachedSession = getCartSessionFromStorage();

      // 2. si hay sesion en cache, sincronizar con backend y luego actualizar la sesión local
      if (cachedSession && 
          cachedSession.carritoId && 
         (cachedSession.usuarioId || cachedSession.sessionId)) {
        await syncWithBackend(cachedSession, cachedItems);
        setCartSession(cachedSession);
        return;
      }

      // 3. si no hay sesion pero hay item en cache, crear un nuevo carrito en backend y sincronizar cache (si hay)
      if (cachedItems.length > 0) {
        await createCartAndSync(cachedItems);
        setItems(cachedItems);
        return;
      }

      // 4. si no hay nada en cache, crear sesión vacía en backend
      await createCartAndSync([]);
    } catch (error) {
      console.error("Error inicializando carrito:", error);
      showToast("Error al cargar carrito", "warning");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sincroniza el cache local con el backend
   */
  const syncWithBackend = async (
    session: CartSession,
    cachedItems: CartItem[],
  ) => {
    try {
      const response = await carritoService.obtenerCarrito(session);

      if (response.success && "data" in response && response.data) {
        const backendItems = mapBackendToCartItems(
          response.data.items as DetalleCarritoResponse[],
        );

        // comparamos en formato JSON para evitar problemas de referencia
        if (JSON.stringify(backendItems) !== JSON.stringify(cachedItems)) {
          saveCartToStorage(backendItems);
          setItems(backendItems);
        } else {
          setItems(cachedItems);
        }
      }else if ("status" in response && response.status === 404) {
        if(session.carritoId && session.usuarioId && (session.sessionId === undefined || session.sessionId === null)){ 
         const responseActualizar = await carritoService.actualizarCarrito(session.carritoId, session.usuarioId);
          if(responseActualizar.success){
            console.log("Carrito actualizado correctamente en backend");
          }
        }else {
          await createCartAndSync([]);
        }
      }
    } catch (error) {
      console.error("Error sincronizando con backend:", error);
    }
  };

  /**
   * Crea un carrito en backend y sincroniza items locales
   */
  const createCartAndSync = async (localItems: CartItem[]) => {
    try {
      const cartSession: CartSession = {
        usuarioId: user ? user.id : undefined,
        // sessionId se genera en backend si no hay usuarioId
      };

      const response = await carritoService.inicializarCarrito(cartSession);

      if (response.success && "data" in response && response.data) {
        const newSession: CartSession = {
          carritoId: response.data.carritoId,
          usuarioId: response.data.usuarioId,
          sessionId: response.data.sessionId,
        };

        // guardamos la sesion en el LocalStorage
        saveCartSessionToStorage(newSession);

        // Sincroniza items locales al backend si hay
        if (localItems.length > 0 && newSession.carritoId && (newSession.usuarioId || newSession.sessionId)) {
          await syncLocalItemsToBackend(newSession, localItems);
        }

        // Actualizar sesión en estado
        setCartSession(newSession);
      }
    } catch (error) {
      console.error("Error creando carrito:", error);
    }
  };

  /**
   * Sube items locales al backend uno por uno
   */
  const syncLocalItemsToBackend = async (
    session: CartSession,
    localItems: CartItem[],
  ) => {
    if (
      session.carritoId &&
      (session.usuarioId || session.sessionId) &&
      localItems.length !== 0
    ) {
      for (const item of localItems) {
        try {
          const detalleRequest: DetalleCarritoRequest = {
            carritoId: session.carritoId,
            usuarioId: session.usuarioId,
            sessionId: session.sessionId,
            productoId: item.id,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
          };

          const response =
            await carritoService.guardarProductoEnCarrito(detalleRequest);

          if (response.success && "data" in response && response.data) {
            // Actualizar detalleId en el item
            item.detalleId = response.data.id;
          }
        } catch (error) {
          console.error(`Error sincronizando item ${item.id}:`, error);
        }
      }

      // Actualizar items con detalleId
      saveCartToStorage(localItems);
      setItems([...localItems]);
    }
  };

  /**
   * Asegura que exista una sesión de carrito
   */
  const ensureCartSession = async (): Promise<CartSession | null> => {
    
    const cachedSession = getCartSessionFromStorage();
    
    if (cachedSession 
      && cachedSession.carritoId 
      && (cachedSession.usuarioId || cachedSession.sessionId)) {
        setCartSession(cachedSession);
      return cachedSession;
    }

    try {
      const newCartSession: CartSession = {
        usuarioId: user ? user.id : undefined,
      };

      const response = await carritoService.inicializarCarrito(newCartSession);

      if (response.success && "data" in response && response.data) {
        const session: CartSession = {
          carritoId: response.data.carritoId,
          usuarioId: response.data.usuarioId,
          sessionId: response.data.sessionId,
        };

        saveCartSessionToStorage(session);
        setCartSession(session);
        return session;
      } else {
        console.error("❌ Error en respuesta del backend:", response);
      }
    } catch (error) {
      console.error("❌ Error creando sesión de carrito:", error);
    }

    return null;
  };

  /**
   * Convierte la respuesta del backend a CartItems
   */
  const mapBackendToCartItems = (
    items: DetalleCarritoResponse[],
  ): CartItem[] => {
    return items.map((item) => ({
      id: item.id,
      detalleId: item.id,
      nombre: item.productoNombre,
      marca: item.marca,
      imagenUrl: item.productoImagenUrl,
      precio: item.precioUnitario,
      cantidad: item.cantidad,
      stock: item.stock,
      categoriaId: item.categoriaId,
    }));
  };

  /**
   * Agrega un producto al carrito (cache + backend)
   */
  const agregarAlCarrito = async (
    product: CatalogProduct,
    cantidad: number,
  ) => {
    // Validar stock
    const stockValidation = validateStock(cantidad, product.stock);
    if (!stockValidation.valid) {
      showToast(stockValidation.message || "Error de validación", "error");
      return;
    }

    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      // Producto ya existe - actualizar cantidad
      const newCantidad = existingItem.cantidad + cantidad;
      const newStockValidation = validateStock(newCantidad, product.stock);

      if (!newStockValidation.valid) {
        showToast(newStockValidation.message || "Error de validación", "error");
        return;
      }

      await actualizarCantidad(existingItem.id, newCantidad);
      showToast(`${cantidad} unidad(es) más agregadas al carrito`, "success");
    } else {

      // primero nos aseguramos de tener una sesión de carrito válida
      const session = await ensureCartSession();

      if (!session) {
        console.error(
          "como no se pudo obtener una sesion no se puede agregar al carrito",
        );
        return;
      }

      // 2. Agregar inmediatamente al cache (UX rápida)
      const newItem: CartItem = {
        id: product.id,
        nombre: product.nombre,
        marca: product.marca,
        imagenUrl: product.imagenUrl,
        precio: product.precio,
        cantidad,
        stock: product.stock,
        categoriaId: product.categoriaId,
      };

      setItems((prevItems) => [...prevItems, newItem]);

      // 3. Sincronizar con backend en segundo plano
      setIsSyncing(true);

      try {
        const detalleRequest: DetalleCarritoRequest = {
          carritoId: session.carritoId,
          usuarioId: session.usuarioId,
          sessionId: session.sessionId,
          productoId: product.id,
          cantidad,
          precioUnitario: product.precio,
        };

        const response =
          await carritoService.guardarProductoEnCarrito(detalleRequest);

        if (response.success && "data" in response && response.data) {
          // Actualizar con detalleId
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === product.id
                ? { ...item, detalleId: response.data!.id }
                : item,
            ),
          );
          // confirmacion de producto agregado al carrito
          showToast("Producto agregado al carrito", "success");

        } else if ("message" in response) {
          console.error(response.message);
          showToast(
            "Tenemos problemas en nuestro servidor, intentelo mas tarde",
            "warning",
          );
          // Mantener en cache aunque falle el backend
        }
      } catch (error) {
        console.error("Error guardando en backend:", error);
        showToast("Producto guardado solo localmente", "warning");
      } finally {
        setIsSyncing(false);
      }
    }
  };

  /**
   * Elimina un producto del carrito (cache + backend)
   */
  const eliminarDelCarrito = async (productId: number) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;

    // 1. Eliminar inmediatamente del cache (UX rápida)
    setItems((prevItems) => prevItems.filter((i) => i.id !== productId));
    showToast("Producto eliminado del carrito", "info");

    // 2. Si tiene detalleId, eliminar del backend
    if (item.detalleId && cartSession) {
      setIsSyncing(true);

      try {
        const eliminarRequest: EliminarDetalleCarrito = {
          productoId: productId,
          carritoId: cartSession.carritoId,
          usuarioId: cartSession.usuarioId,
          sessionId: cartSession.sessionId,
        };

        const response =
          await carritoService.eliminarDetalleCarrito(eliminarRequest);

        if (!response.success) {
          showToast("Error al eliminar del servidor", "warning");
          // Ya se eliminó del cache, no revertimos
        }
      } catch (error) {
        console.error("Error eliminando del backend:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  /**
   * Actualiza la cantidad de un producto (cache + backend)
   */
  const actualizarCantidad = async (productId: number, cantidad: number) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;

    // Validar stock
    const stockValidation = validateStock(cantidad, item.stock);
    if (!stockValidation.valid) {
      showToast(stockValidation.message || "Error de validación", "error");
      return;
    }

    // 1. Actualizar inmediatamente en cache (UX rápida)
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === productId ? { ...i, cantidad } : i)),
    );

    // 2. Si tiene detalleId, actualizar en backend
    if (item.detalleId && cartSession) {
      setIsSyncing(true);

      try {
        const actualizarRequest: ActualizarDetalleCarrito = {
          productoId: productId,
          carritoId: cartSession.carritoId,
          usuarioId: cartSession.usuarioId,
          sessionId: cartSession.sessionId,
          cantidad,
        };

        const response =
          await carritoService.actualizarCantidad(actualizarRequest);

        if (!response.success) {
          showToast("Error al actualizar en servidor", "warning");
          // Ya se actualizó en cache, no revertimos
        }
      } catch (error) {
        console.error("Error actualizando cantidad en backend:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  /**
   * Vacía completamente el carrito (cache + backend)
   */

  /* const vaciarCarrito = async () => {
    // 1. Limpiar cache inmediatamente
    setItems([]);
    clearCartStorage();
    showToast("Carrito vaciado", "info");

    // 2. Si hay sesión, eliminar del backend
    if (cartSession) {
      setIsSyncing(true);

      try {
        // Eliminar todos los items del backend
        const eliminaciones = items
          .filter((item) => item.detalleId)
          .map((item) => {
            const eliminarRequest: EliminarDetalleCarrito = {
              detalleId: item.detalleId!,
              carritoId: cartSession.carritoId,
              usuarioId: cartSession.usuarioId,
              sessionId: cartSession.sessionId,
            };
            return carritoService.eliminarDetalleCarrito(eliminarRequest);
          });

        await Promise.all(eliminaciones);

        // Limpiar sesión
        clearCartSessionStorage();
        setCartSession(null);
      } catch (error) {
        console.error("Error vaciando carrito en backend:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  }; */

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
    /* vaciarCarrito, */
    initializeCart,
    obtenerTotal,
    obtenerCantidadTotal,
    isLoading,
    isSyncing,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
};
