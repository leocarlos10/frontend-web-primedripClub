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
  etiqueta?:
    | "Agotado"
    | "Nuevo"
    | "Oferta"
    | "Destacado"
    | "Últimas unidades"
    | null;
  sexo?: "Hombre" | "Mujer" | "Niño" | "Unisex" | null;
  isFeatured?: boolean;
  fechaCreacion: string;
}
