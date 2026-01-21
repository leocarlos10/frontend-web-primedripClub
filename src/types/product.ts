export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  image: string;
  badge?:
    | "Sold Out"
    | "New"
    | "Sale"
    | "Destacado"
    | "Nuevo"
    | "Últimas unidades";
  category?: string;
  isFeatured?: boolean;
}

export type SortOption = "newest" | "price-asc" | "price-desc";
