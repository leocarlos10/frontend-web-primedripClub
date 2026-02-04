import ProductCard from "../home/ProductCard";
import type { CatalogProduct } from "../../types/product";

interface CatalogProductsProps {
  products: CatalogProduct[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export default function CatalogProducts({
  products,
  isLoading = false,
  error,
  onRetry,
}: CatalogProductsProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
            Catálogo
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
            Cargando productos...
          </p>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 mb-4 rounded-lg"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 mb-2 w-1/2"></div>
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
            Catálogo
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
            Todos nuestros productos
          </p>
        </div>

        <div className="text-center py-20">
          <div className="mb-6">
            <span className="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700">
              error
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-zinc-900 dark:bg-white text-white 
              dark:text-zinc-900 text-xs font-bold uppercase tracking-widest 
              hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Reintentar
            </button>
          )}
        </div>
      </section>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
            Catálogo
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
            Todos nuestros productos
          </p>
        </div>

        <div className="text-center py-20">
          <div className="mb-6">
            <span className="material-symbols-outlined text-6xl text-zinc-300 dark:text-zinc-700">
              inventory_2
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
            No hay productos disponibles
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-600">
            Vuelve pronto para ver nuestras novedades
          </p>
        </div>
      </section>
    );
  }

  // Products Grid
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
          Catálogo
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
          Explora nuestra colección completa
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showAddToCart />
        ))}
      </div>

      {/* Total count */}
      <div className="text-center mt-12">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Mostrando {products.length}{" "}
          {products.length === 1 ? "producto" : "productos"}
        </p>
      </div>
    </section>
  );
}
