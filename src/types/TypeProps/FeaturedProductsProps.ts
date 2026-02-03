import type { Product } from "../product";

export type FeaturedProductsProps = {
  products: Product[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
};
