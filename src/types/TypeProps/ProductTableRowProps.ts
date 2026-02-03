import type {ProductBase} from '../product';

export type ProductTableRowProps = {
  product: ProductBase;
  id: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  getStockColor: (stock: number) => string;
  getStatusDisplay: (activo: boolean, stock: number) => { label: string; color: string };
};