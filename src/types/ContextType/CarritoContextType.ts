import type { CartItem } from "../cart/CartItem";
import type { CatalogProduct } from "../product";

export interface CarritoContextType {
  items: CartItem[];
  isLoading: boolean; // cargando el carrito desde el backend o localStorage
  isSyncing: boolean; // sincronizando el carrito con el backend
  agregarAlCarrito: (
    product: CatalogProduct,
    cantidad: number,
  ) => Promise<void>;
  eliminarDelCarrito: (productId: number) => Promise<void>;
  actualizarCantidad: (productId: number, cantidad: number) => Promise<void>;
  /*  vaciarCarrito: () => Promise<void>; */
  obtenerTotal: () => number;
  obtenerCantidadTotal: () => number;
}
