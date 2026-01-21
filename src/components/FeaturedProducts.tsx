import ProductCard from "./ProductCard";
import type { FeaturedProductsProps } from "../types/FeaturedProductsProps";

export default function FeaturedProducts({
  products,
  isLoading = false,
  error,
  onRetry,
}: FeaturedProductsProps) {
  // Filtrar solo productos destacados y solo toma los primeros 8
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
            Destacados
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
            Selección curada de la semana
          </p>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-zinc-200 dark:bg-zinc-800 mb-4"></div>
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
            Destacados
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
            Selección curada de la semana
          </p>
        </div>

        <div className="text-center py-20">
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Reintentar
            </button>
          )}
        </div>
      </section>
    );
  }

  // Empty state
  if (featuredProducts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
            Destacados
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
            Selección curada de la semana
          </p>
        </div>

        <div className="text-center py-20">
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            No hay productos destacados en este momento
          </p>
          <button className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
            Explorar productos
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
          Destacados
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light tracking-wide">
          Selección curada de la semana
        </p>
      </div>

      {/* Products Grid - Mantiene el mismo diseño */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} showAddToCart />
        ))}
      </div>
    </section>
  );
}
