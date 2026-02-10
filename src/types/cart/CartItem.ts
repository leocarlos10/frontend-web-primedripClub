export interface CartItem {
  id: number;
  nombre: string;
  marca: string;
  imagenUrl: string;
  precio: number;
  cantidad: number;
  stock: number;
  categoriaId: number;
}
