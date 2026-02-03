
/* 
    id: 1,
    brand: "reloj 1",
    nombre: "reloj premium",
    precio: 550.0,
    imagenUrl: imagen3,
    badge: "Nuevo",
    isFeatured: true,
*/
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
  fechaCreacion: string;
}

export interface CatalogProduct extends ProductBase {
  badge?:
    | "Sold Out"
    | "New"
    | "Sale"
    | "Destacado"
    | "Nuevo"
    | "Últimas unidades";
  isFeatured?: boolean;
}

// tipo para crear/editar productos Omit excluye las propiedades de id y fechaCreacion
export type ProductFormData = Omit<ProductBase, "id" | "fechaCreacion">;

// tipo para guardar actualizaciones de productos Partial hace todas las propiedades opcionales y agrega un id requerido.
export type ProductUpdateData = Partial<ProductFormData> & {id: number};

export type SortOption = "newest" | "price-asc" | "price-desc";


