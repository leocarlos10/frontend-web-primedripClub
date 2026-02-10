import type { CartItem } from "../cart/CartItem";
import type { CatalogProduct } from "../product";

export interface CarritoContextType {
  items: CartItem[];
  agregarAlCarrito: (product: CatalogProduct, cantidad: number) => void;
  eliminarDelCarrito: (productId: number) => void;
  actualizarCantidad: (productId: number, cantidad: number) => void;
  vaciarCarrito: () => void;
  obtenerTotal: () => number;
  obtenerCantidadTotal: () => number;
}
