/**
 * Request para crear o actualizar un producto
 * Validaciones aplicadas en el backend
 */
export interface ProductoRequest {
  nombre: string; // Obligatorio, max 150 caracteres
  descripcion: string; // max 1000 caracteres
  precio: number; // Obligatorio, debe ser mayor a 0
  stock: number; // Obligatorio, no puede ser negativo
  marca: string; // Obligatorio, max 100 caracteres
  imagenUrl: string; // Obligatorio, max 255 caracteres
  activo: boolean; // Obligatorio
  categoriaId: number; // Obligatorio
}
