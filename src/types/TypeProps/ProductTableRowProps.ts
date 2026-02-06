import type { ProductBase } from "../product";
import type { CategoriaResponse } from "../requestType/categoria/CategoriaResponse";

export type ProductTableRowProps = {
  product: ProductBase;
  id: number;
  categories: CategoriaResponse[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  getStockColor: (stock: number) => string;
  getStatusDisplay: (
    activo: boolean,
    stock: number,
  ) => { label: string; color: string };
};
