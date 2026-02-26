import type { CatalogProduct } from "../product";

export type FeaturedProductsProps = {
  products: CatalogProduct[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
};
