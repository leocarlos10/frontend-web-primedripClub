import type { ProductFormData, ProductBase } from "../product";

export type ProductFormDialogProps ={
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  product?: ProductBase | null;
  mode: "create" | "edit";
}
