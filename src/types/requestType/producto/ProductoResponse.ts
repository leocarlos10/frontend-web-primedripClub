/**
 * Respuesta del backend con los datos de un producto
 */
export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  marca: string;
  imagenUrl: string;
  activo: boolean;
  categoriaId: number;
  categoriaNombre: string;
  fechaCreacion: string; 
}
