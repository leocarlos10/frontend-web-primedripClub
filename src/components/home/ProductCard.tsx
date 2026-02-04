import { url_backend_image } from "../../Config";
import type { ProductCardProps } from "../../types/TypeProps/ProductCardProps";

export default function ProductCard({
  product,
  showAddToCart = false,
}: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4 rounded-lg">
        {/* Image Placeholder */}
        <img
          src={`${url_backend_image}${product.imagenUrl}`}
          alt={`imagen del producto ${product.nombre}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Add to Cart Button */}
        {showAddToCart && (
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button className="w-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 py-3 text-xs font-bold uppercase tracking-widest cursor-pointer">
              Añadir al Carrito
            </button>
          </div>
        )}

        {/* Badge */}
        {product.etiqueta && (
          <span className="absolute top-4 left-4 bg-primary text-white px-2 py-1 text-[10px] font-bold uppercase tracking-tighter">
            {product.etiqueta}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
            {product.marca}
          </h4>
          <p className="text-sm font-medium uppercase tracking-tight">
            {product.nombre}
          </p>
        </div>
        <p className="text-sm font-bold">
          {product.precio.toLocaleString("es-CO", {
            minimumFractionDigits: 0,
          })}{" "}
          <span className="text-xs text-zinc-500">COP</span>
        </p>
      </div>
    </div>
  );
}
