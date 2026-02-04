export type SexoProducto = "Hombre" | "Mujer" | "Niño" | "Unisex";

export interface ProductBase {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  marca: string;
  imagenUrl: string;
  activo: boolean;
  categoriaId: number;
  sexo?: SexoProducto | null;
  fechaCreacion: string;
}

export interface CatalogProduct extends ProductBase {
  etiqueta?:
    | "Agotado"
    | "Nuevo"
    | "Oferta"
    | "Destacado"
    | "Últimas unidades"
    | null;
  sexo?: SexoProducto | null;
  isFeatured?: boolean;
}

// tipo para crear/editar productos Omit excluye las propiedades de id y fechaCreacion
export type ProductFormData = Omit<ProductBase, "id" | "fechaCreacion"> & {
  etiqueta?:
    | "Agotado"
    | "Nuevo"
    | "Oferta"
    | "Destacado"
    | "Últimas unidades"
    | null;
  sexo?: SexoProducto | null;
  isFeatured?: boolean;
};

// tipo para guardar actualizaciones de productos Partial hace todas las propiedades opcionales y agrega un id requerido.
export type ProductUpdateData = Partial<ProductFormData> & { id: number };

export type SortOption = "newest" | "price-asc" | "price-desc";
