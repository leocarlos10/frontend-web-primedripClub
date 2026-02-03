/**
 * Request para crear o actualizar una categoría
 * Validaciones aplicadas en el backend
 */
export interface CategoriaRequest {
  nombre: string; // Obligatorio, max 100 caracteres
  descripcion: string; // max 500 caracteres
}
