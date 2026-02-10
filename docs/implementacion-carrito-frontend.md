# 🛒 Implementación del Sistema de Carrito - Frontend

**Fecha:** 9 de febrero de 2026  
**Objetivo:** Implementar el flujo completo de carrito de compras en React + TypeScript

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Tipos y Interfaces](#tipos-y-interfaces)
3. [Contexto del Carrito](#contexto-del-carrito)
4. [Utilidades](#utilidades)
5. [Componentes](#componentes)
6. [Páginas](#páginas)
7. [Integración con API](#integración-con-api)
8. [Testing](#testing)

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DEL CARRITO                         │
└─────────────────────────────────────────────────────────────┘

1. Usuario agrega producto
   ↓
2. Se guarda en Context + LocalStorage (temporal)
   ↓
3. Se sincroniza con Backend (Carrito + DetalleCarrito)
   ↓
4. Usuario va a CartPage
   ↓
5. Procede a Checkout (CheckoutPage)
   ↓
6. Crea Pedido desde Carrito
   ↓
7. Va a página de Pago (PaymentPage)
   ↓
8. Confirma Pago → Genera Pedido
   ↓
9. Confirma y vacía el carrito
```

---

## 📝 Paso 1: Definir Tipos e Interfaces

### Crear: `src/types/cart/CartItem.ts`

```typescript
export interface CartItem {
  id: string;
  productoId: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;
  stock: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  costoEnvio: number;
  total: number;
  cantidadItems: number;
}

export interface AddToCartRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface UpdateCartItemRequest {
  productoId: number;
  cantidad: number;
}
```

### Crear: `src/types/ContextType/CarritoContextType.ts` (actualizar)

```typescript
import { CartItem, CartSummary } from "../cart/CartItem";

export interface CarritoContextType {
  // Estado
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;

  // Acciones
  agregarProducto: (productoId: number, cantidad: number) => Promise<void>;
  actualizarCantidad: (productoId: number, cantidad: number) => Promise<void>;
  eliminarProducto: (productoId: number) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  sincronizarConBackend: () => Promise<void>;

  // Utilidades
  obtenerCantidadProducto: (productoId: number) => number;
  existeEnCarrito: (productoId: number) => boolean;
}
```

### Crear: `src/types/requestType/pedido/CrearPedidoRequest.ts`

```typescript
export interface DatosEnvio {
  emailContacto: string;
  nombreContacto: string;
  telefono: string;
  direccionEnvio: string;
  notas?: string;
}

export interface CrearPedidoRequest extends DatosEnvio {}

export interface PedidoResponse {
  id: number;
  usuarioId?: number;
  emailContacto: string;
  nombreContacto: string;
  telefono: string;
  direccionEnvio: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  estado: EstadoPedido;
  items: DetallePedidoResponse[];
  fechaCreacion: string;
}

export enum EstadoPedido {
  PENDIENTE = "PENDIENTE",
  PAGO_PENDIENTE = "PAGO_PENDIENTE",
  PAGADO = "PAGADO",
  PROCESANDO = "PROCESANDO",
  ENVIADO = "ENVIADO",
  ENTREGADO = "ENTREGADO",
  CANCELADO = "CANCELADO",
}

export interface DetallePedidoResponse {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
```

### Crear: `src/types/requestType/pago/PagoRequest.ts`

```typescript
export interface ProcesarPagoRequest {
  pedidoId: number;
  metodo: MetodoPago;
  datosTarjeta?: DatosTarjeta;
}

export enum MetodoPago {
  TARJETA_CREDITO = "TARJETA_CREDITO",
  TARJETA_DEBITO = "TARJETA_DEBITO",
  PSE = "PSE",
  TRANSFERENCIA = "TRANSFERENCIA",
  EFECTIVO = "EFECTIVO",
  NEQUI = "NEQUI",
  DAVIPLATA = "DAVIPLATA",
}

export interface DatosTarjeta {
  numero: string;
  titular: string;
  fechaExpiracion: string;
  cvv: string;
}

export interface PagoResponse {
  id: number;
  pedidoId: number;
  metodo: MetodoPago;
  estado: EstadoPago;
  referencia?: string;
  monto: number;
  fechaPago?: string;
}

export enum EstadoPago {
  PENDIENTE = "PENDIENTE",
  APROBADO = "APROBADO",
  RECHAZADO = "RECHAZADO",
  REEMBOLSADO = "REEMBOLSADO",
}
```

---

## 🔧 Paso 2: Utilidades del Carrito

### Crear: `src/utils/sessionUtils.ts`

```typescript
/**
 * Genera o recupera el Session ID para usuarios anónimos
 */
export const getOrCreateSessionId = (): string => {
  const SESSION_KEY = "primedripclub_session_id";

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    // Generar UUID v4
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);

    console.log("[Session] Nuevo session ID creado:", sessionId);
  }

  return sessionId;
};

/**
 * Limpia el session ID (al iniciar sesión)
 */
export const clearSessionId = (): void => {
  const SESSION_KEY = "primedripclub_session_id";
  localStorage.removeItem(SESSION_KEY);
  console.log("[Session] Session ID eliminado");
};

/**
 * Valida si existe un session ID
 */
export const hasSessionId = (): boolean => {
  const SESSION_KEY = "primedripclub_session_id";
  return localStorage.getItem(SESSION_KEY) !== null;
};
```

### Actualizar: `src/utils/carritoUtils/cartStorage.ts`

```typescript
import { CartItem } from "../../types/cart/CartItem";

const CART_STORAGE_KEY = "primedripclub_cart_temp";

/**
 * Guarda el carrito temporalmente en localStorage
 * (Útil como backup antes de sincronizar con backend)
 */
export const saveCartToLocalStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("[Cart Storage] Error al guardar:", error);
  }
};

/**
 * Recupera el carrito del localStorage
 */
export const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("[Cart Storage] Error al cargar:", error);
    return [];
  }
};

/**
 * Limpia el carrito del localStorage
 */
export const clearCartFromLocalStorage = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

/**
 * Verifica si hay un carrito guardado
 */
export const hasStoredCart = (): boolean => {
  return localStorage.getItem(CART_STORAGE_KEY) !== null;
};
```

### Actualizar: `src/utils/carritoUtils/cartCalculations.ts`

```typescript
import { CartItem, CartSummary } from "../../types/cart/CartItem";

/**
 * Calcula el resumen total del carrito
 */
export const calculateCartSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const cantidadItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  // Calcular costo de envío (ejemplo: gratis si > $100.000)
  const costoEnvio = subtotal >= 100000 ? 0 : 10000;

  const total = subtotal + costoEnvio;

  return {
    items,
    subtotal,
    costoEnvio,
    total,
    cantidadItems,
  };
};

/**
 * Calcula el subtotal de un item
 */
export const calculateItemSubtotal = (
  precio: number,
  cantidad: number,
): number => {
  return precio * cantidad;
};

/**
 * Formatea precio a COP
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};
```

### Crear: `src/utils/carritoUtils/cartApi.ts`

```typescript
import { getHeaders } from "../Headers";
import { getOrCreateSessionId } from "../sessionUtils";
import {
  AddToCartRequest,
  UpdateCartItemRequest,
} from "../../types/cart/CartItem";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Obtiene los headers con autorización y session ID
 */
const getCartHeaders = (): HeadersInit => {
  const headers = getHeaders();

  // Si no está autenticado, agregar Session-ID
  const token = localStorage.getItem("token");
  if (!token) {
    headers["Session-ID"] = getOrCreateSessionId();
  }

  return headers;
};

/**
 * Obtiene el carrito desde el backend
 */
export const fetchCart = async () => {
  const response = await fetch(`${API_URL}/carrito`, {
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al obtener el carrito");
  }

  return response.json();
};

/**
 * Agrega un producto al carrito
 */
export const addToCartAPI = async (request: AddToCartRequest) => {
  const response = await fetch(`${API_URL}/carrito/agregar`, {
    method: "POST",
    headers: getCartHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al agregar producto");
  }

  return response.json();
};

/**
 * Actualiza la cantidad de un producto
 */
export const updateCartItemAPI = async (request: UpdateCartItemRequest) => {
  const response = await fetch(`${API_URL}/carrito/actualizar`, {
    method: "PUT",
    headers: getCartHeaders(),
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar cantidad");
  }

  return response.json();
};

/**
 * Elimina un producto del carrito
 */
export const removeFromCartAPI = async (productoId: number) => {
  const response = await fetch(`${API_URL}/carrito/eliminar/${productoId}`, {
    method: "DELETE",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al eliminar producto");
  }
};

/**
 * Vacía el carrito completamente
 */
export const clearCartAPI = async () => {
  const response = await fetch(`${API_URL}/carrito/vaciar`, {
    method: "DELETE",
    headers: getCartHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error al vaciar el carrito");
  }
};
```

---

## 🎯 Paso 3: Context del Carrito

### Actualizar: `src/context/Carrito.Context.tsx`

```typescript
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { CarritoContextType } from '../types/ContextType/CarritoContextType';
import { CartItem, CartSummary } from '../types/cart/CartItem';
import { calculateCartSummary, calculateItemSubtotal } from '../utils/carritoUtils/cartCalculations';
import { saveCartToLocalStorage, loadCartFromLocalStorage, clearCartFromLocalStorage } from '../utils/carritoUtils/cartStorage';
import * as cartApi from '../utils/carritoUtils/cartApi';
import { useToast } from '../hooks/useToast';

export const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    items: [],
    subtotal: 0,
    costoEnvio: 0,
    total: 0,
    cantidadItems: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  // Cargar carrito al iniciar
  useEffect(() => {
    cargarCarrito();
  }, []);

  // Actualizar summary cuando cambian los items
  useEffect(() => {
    const newSummary = calculateCartSummary(items);
    setSummary(newSummary);
    saveCartToLocalStorage(items);
  }, [items]);

  /**
   * Carga el carrito desde el backend
   */
  const cargarCarrito = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await cartApi.fetchCart();

      // Transformar respuesta del backend a CartItem[]
      const cartItems: CartItem[] = data.items.map((item: any) => ({
        id: `${item.productoId}`,
        productoId: item.productoId,
        nombre: item.nombreProducto,
        descripcion: item.descripcion,
        precio: item.precioUnitario,
        cantidad: item.cantidad,
        imagenUrl: item.imagenUrl,
        stock: item.stock,
        subtotal: calculateItemSubtotal(item.precioUnitario, item.cantidad)
      }));

      setItems(cartItems);
    } catch (err: any) {
      console.error('[Carrito] Error al cargar:', err);
      // En caso de error, cargar desde localStorage
      const localItems = loadCartFromLocalStorage();
      setItems(localItems);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Agrega un producto al carrito
   */
  const agregarProducto = async (productoId: number, cantidad: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener producto para precio actual
      const response = await fetch(`${import.meta.env.VITE_API_URL}/productos/${productoId}`);
      const producto = await response.json();

      await cartApi.addToCartAPI({
        productoId,
        cantidad,
        precioUnitario: producto.precio
      });

      // Recargar carrito
      await cargarCarrito();

      showToast(`${producto.nombre} agregado al carrito`, 'success');
    } catch (err: any) {
      setError(err.message);
      showToast(err.message || 'Error al agregar producto', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza la cantidad de un producto
   */
  const actualizarCantidad = async (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      await eliminarProducto(productoId);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await cartApi.updateCartItemAPI({ productoId, cantidad });
      await cargarCarrito();
    } catch (err: any) {
      setError(err.message);
      showToast('Error al actualizar cantidad', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Elimina un producto del carrito
   */
  const eliminarProducto = async (productoId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await cartApi.removeFromCartAPI(productoId);
      await cargarCarrito();
      showToast('Producto eliminado del carrito', 'info');
    } catch (err: any) {
      setError(err.message);
      showToast('Error al eliminar producto', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Vacía el carrito completamente
   */
  const vaciarCarrito = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await cartApi.clearCartAPI();
      setItems([]);
      clearCartFromLocalStorage();
      showToast('Carrito vaciado', 'info');
    } catch (err: any) {
      setError(err.message);
      showToast('Error al vaciar carrito', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sincroniza el carrito con el backend
   */
  const sincronizarConBackend = async () => {
    await cargarCarrito();
  };

  /**
   * Obtiene la cantidad de un producto en el carrito
   */
  const obtenerCantidadProducto = useCallback((productoId: number): number => {
    const item = items.find(item => item.productoId === productoId);
    return item?.cantidad || 0;
  }, [items]);

  /**
   * Verifica si un producto existe en el carrito
   */
  const existeEnCarrito = useCallback((productoId: number): boolean => {
    return items.some(item => item.productoId === productoId);
  }, [items]);

  const value: CarritoContextType = {
    items,
    summary,
    isLoading,
    error,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    sincronizarConBackend,
    obtenerCantidadProducto,
    existeEnCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
```

---

## 🎨 Paso 4: Componentes del Carrito

### Crear: `src/components/cart/CartItem.tsx`

```typescript
import React from 'react';
import { CartItem as CartItemType } from '../../types/cart/CartItem';
import { formatPrice } from '../../utils/carritoUtils/cartCalculations';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productoId: number, cantidad: number) => void;
  onRemove: (productoId: number) => void;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove
}) => {
  const handleIncrement = () => {
    if (item.cantidad < item.stock) {
      onUpdateQuantity(item.productoId, item.cantidad + 1);
    }
  };

  const handleDecrement = () => {
    if (item.cantidad > 1) {
      onUpdateQuantity(item.productoId, item.cantidad - 1);
    } else {
      onRemove(item.productoId);
    }
  };

  return (
    <div className="cart-item">
      <img
        src={item.imagenUrl || '/placeholder.png'}
        alt={item.nombre}
        className="cart-item__image"
      />

      <div className="cart-item__details">
        <h3>{item.nombre}</h3>
        <p className="cart-item__price">{formatPrice(item.precio)}</p>

        {item.cantidad > item.stock && (
          <p className="cart-item__warning">
            Stock insuficiente (disponible: {item.stock})
          </p>
        )}
      </div>

      <div className="cart-item__quantity">
        <button
          onClick={handleDecrement}
          className="quantity-btn"
          aria-label="Disminuir cantidad"
        >
          -
        </button>

        <span className="quantity-value">{item.cantidad}</span>

        <button
          onClick={handleIncrement}
          className="quantity-btn"
          disabled={item.cantidad >= item.stock}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      <div className="cart-item__subtotal">
        {formatPrice(item.subtotal)}
      </div>

      <button
        onClick={() => onRemove(item.productoId)}
        className="cart-item__remove"
        aria-label="Eliminar producto"
      >
        🗑️
      </button>
    </div>
  );
};
```

### Crear: `src/components/cart/CartSummary.tsx`

```typescript
import React from 'react';
import { CartSummary as CartSummaryType } from '../../types/cart/CartItem';
import { formatPrice } from '../../utils/carritoUtils/cartCalculations';
import { Button } from '../ui/Button';

interface CartSummaryProps {
  summary: CartSummaryType;
  onCheckout: () => void;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  summary,
  onCheckout,
  isLoading = false
}) => {
  const hasItems = summary.cantidadItems > 0;

  return (
    <div className="cart-summary">
      <h2>Resumen del Pedido</h2>

      <div className="cart-summary__row">
        <span>Subtotal ({summary.cantidadItems} items)</span>
        <span>{formatPrice(summary.subtotal)}</span>
      </div>

      <div className="cart-summary__row">
        <span>Costo de envío</span>
        <span>
          {summary.costoEnvio === 0
            ? '¡Gratis!'
            : formatPrice(summary.costoEnvio)
          }
        </span>
      </div>

      {summary.subtotal < 100000 && summary.subtotal > 0 && (
        <p className="cart-summary__tip">
          Agrega {formatPrice(100000 - summary.subtotal)} más para envío gratis
        </p>
      )}

      <div className="cart-summary__divider" />

      <div className="cart-summary__total">
        <span>Total</span>
        <span className="total-amount">{formatPrice(summary.total)}</span>
      </div>

      <Button
        onClick={onCheckout}
        disabled={!hasItems || isLoading}
        fullWidth
        variant="primary"
      >
        {isLoading ? 'Procesando...' : 'Proceder al Pago'}
      </Button>

      <p className="cart-summary__secure">
        🔒 Compra 100% segura
      </p>
    </div>
  );
};
```

---

## 📄 Paso 5: Páginas

### Actualizar: `src/pages/public/CartPage.tsx`

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../hooks/useCarrito';
import { CartItemComponent } from '../../components/cart/CartItem';
import { CartSummary } from '../../components/cart/CartSummary';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/ui/Button';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    summary,
    isLoading,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito
  } = useCarrito();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/catalogo');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega productos para comenzar tu compra!</p>
        <Button onClick={handleContinueShopping}>
          Ver Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1>Carrito de Compras</h1>
        <Button
          variant="ghost"
          onClick={vaciarCarrito}
        >
          Vaciar Carrito
        </Button>
      </div>

      <div className="cart-page__content">
        <div className="cart-items">
          {items.map(item => (
            <CartItemComponent
              key={item.id}
              item={item}
              onUpdate Quantity={actualizarCantidad}
              onRemove={eliminarProducto}
            />
          ))}
        </div>

        <aside className="cart-sidebar">
          <CartSummary
            summary={summary}
            onCheckout={handleCheckout}
            isLoading={isLoading}
          />
        </aside>
      </div>

      <Button
        variant="secondary"
        onClick={handleContinueShopping}
      >
        ← Continuar Comprando
      </Button>
    </div>
  );
};
```

### Crear: `src/pages/public/CheckoutPage.tsx`

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../hooks/useCarrito';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { DatosEnvio } from '../../types/requestType/pedido/CrearPedidoRequest';
import { Button } from '../../components/ui/Button';
import { getHeaders } from '../../utils/Headers';
import { getOrCreateSessionId } from '../../utils/sessionUtils';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { summary, items, vaciarCarrito } = useCarrito();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [datosEnvio, setDatosEnvio] = useState<DatosEnvio>({
    emailContacto: user?.email || '',
    nombreContacto: user?.nombre || '',
    telefono: '',
    direccionEnvio: '',
    notas: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDatosEnvio(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('El carrito está vacío', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const headers = getHeaders();
      if (!user) {
        headers['Session-ID'] = getOrCreateSessionId();
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/crear`, {
        method: 'POST',
        headers,
        body: JSON.stringify(datosEnvio)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear pedido');
      }

      const pedido = await response.json();

      showToast('Pedido creado exitosamente', 'success');

      // Navegar a página de pago
      navigate(`/pago/${pedido.id}`);

    } catch (error: any) {
      console.error('[Checkout] Error:', error);
      showToast(error.message || 'Error al procesar pedido', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <section className="form-section">
            <h2>Datos de Contacto</h2>

            <div className="form-field">
              <label htmlFor="nombreContacto">Nombre Completo *</label>
              <input
                type="text"
                id="nombreContacto"
                name="nombreContacto"
                value={datosEnvio.nombreContacto}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="emailContacto">Email *</label>
              <input
                type="email"
                id="emailContacto"
                name="emailContacto"
                value={datosEnvio.emailContacto}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={datosEnvio.telefono}
                onChange={handleInputChange}
                required
                placeholder="3001234567"
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Dirección de Envío</h2>

            <div className="form-field">
              <label htmlFor="direccionEnvio">Dirección Completa *</label>
              <textarea
                id="direccionEnvio"
                name="direccionEnvio"
                value={datosEnvio.direccionEnvio}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Calle 123 #45-67, Apartamento 101, Bogotá"
              />
            </div>

            <div className="form-field">
              <label htmlFor="notas">Notas Adicionales</label>
              <textarea
                id="notas"
                name="notas"
                value={datosEnvio.notas}
                onChange={handleInputChange}
                rows={3}
                placeholder="Instrucciones especiales para la entrega..."
              />
            </div>
          </section>

          <Button
            type="submit"
            disabled={isProcessing}
            fullWidth
          >
            {isProcessing ? 'Procesando...' : `Continuar al Pago`}
          </Button>
        </form>

        <aside className="checkout-summary">
          <h2>Resumen del Pedido</h2>

          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.nombre} x{item.cantidad}</span>
                <span>${item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${summary.subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>
                {summary.costoEnvio === 0
                  ? '¡Gratis!'
                  : `$${summary.costoEnvio.toLocaleString()}`
                }
              </span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${summary.total.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
```

---

## ✅ Checklist de Implementación

### Tipos y Structures:

- [ ] `CartItem.ts`
- [ ] `CarritoContextType.ts`
- [ ] `CrearPedidoRequest.ts`
- [ ] `PagoRequest.ts`

### Utilidades:

- [ ] `sessionUtils.ts`
- [ ] `cartStorage.ts`
- [ ] `cartCalculations.ts`
- [ ] `cartApi.ts`

### Context:

- [ ] Actualizar `Carrito.Context.tsx`

### Componentes:

- [ ] `CartItem.tsx`
- [ ] `CartSummary.tsx`
- [ ] Actualizar `Header.tsx` (badge del carrito)

### Páginas:

- [ ] `CartPage.tsx`
- [ ] `CheckoutPage.tsx`
- [ ] `PaymentPage.tsx`
- [ ] `OrderConfirmationPage.tsx`

### Rutas:

- [ ] Agregar rutas en `AppRoutes.tsx`

### Estilos:

- [ ] CSS para componentes del carrito
- [ ] Responsive design

### Testing:

- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests E2E

---

## 🧪 Testing

### Test del Context:

```typescript
// __tests__/context/Carrito.Context.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { CarritoProvider } from '../../context/Carrito.Context';
import { useCarrito } from '../../hooks/useCarrito';

describe('CarritoContext', () => {
  it('debe agregar un producto al carrito', async () => {
    const wrapper = ({ children }) => (
      <CarritoProvider>{children}</CarritoProvider>
    );

    const { result } = renderHook(() => useCarrito(), { wrapper });

    await act(async () => {
      await result.current.agregarProducto(1, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(2);
  });
});
```

---

**Próximo paso:** Ver documento `integracion-backend.md` para la implementación del backend.
