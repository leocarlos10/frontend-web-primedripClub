import { useState } from "react";
import { Link } from "react-router";
import { PublicLayout } from "../../components";
import { useCarrito } from "../../hooks/useCarrito";
import { url_backend_image } from "../../Config";

export const CartPage = () => {
     const { items, actualizarCantidad, eliminarDelCarrito, obtenerTotal } =
    useCarrito();
    const [promoCode, setPromoCode] = useState("");
    const subtotal = obtenerTotal();
    const costoEnvio = 0; // Gratis por ahora
    const total = subtotal + costoEnvio;

  // actualiza la cantidad del producto en el carrito
  const updateQuantity = (id: number, delta: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = item.cantidad + delta;
      // No permitir menos de 1 ni más que el stock disponible
      if (newQuantity >= 1 && newQuantity <= item.stock) {
        actualizarCantidad(id, newQuantity);
      }
    }
  };

  const removeItem = (id: number) => {
    eliminarDelCarrito(id);
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
    }) + " COP";

  return (
    <PublicLayout>
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight mb-2">Carrito</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
            Resumen de artículos exclusivos
          </p>
        </div>
        {/* pagina cuando el carrito esta vacio */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4 block">
              shopping_bag
            </span>
            <p className="text-zinc-500 text-sm mb-6">Tu carrito está vacío</p>
            <Link
              to="/catalogo"
              className="inline-block bg-white text-black py-3 px-8 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-200 transition-colors"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Lista de productos */}
            <div className="flex-1 space-y-10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800"
                >
                  {/* Imagen del producto */}
                  <div className="w-40 h-52 bg-zinc-100 dark:bg-zinc-900 overflow-hidden shrink-0">
                    <img
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                      src={`${url_backend_image}${item.imagenUrl}`}
                    />
                  </div>

                  {/* Info del producto */}
                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-2">
                          {item.nombre}
                        </h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                          Marca: {item.marca}
                        </p>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                          Stock disponible: {item.stock} unidades
                        </p>
                      </div>
                      <p className="text-sm font-semibold tracking-wider">
                        {formatPrice(item.precio)}
                      </p>
                    </div>

                    {/* Controles de cantidad y eliminar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-800">
                        <button
                          className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-xs text-zinc-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <input
                          className="w-12 text-center bg-transparent border-none focus:ring-0 text-[11px] font-bold"
                          type="number"
                          value={item.cantidad}
                          readOnly
                        />
                        <button
                          className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-xs text-zinc-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.cantidad >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer"
                        onClick={() => removeItem(item.id)}
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Seguir comprando */}
              <div className="pt-6">
                <Link
                  to="/catalogo"
                  className="text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 hover:text-zinc-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_back
                  </span>
                  Seguir comprando
                </Link>
              </div>
            </div>

            {/* Resumen del pedido */}
            <aside className="w-full lg:w-105">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-10 sticky top-32 border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                  Resumen de pedido
                </h2>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest">
                    <span className="text-zinc-500">Costo de Envío</span>
                    <span>Gratis</span>
                  </div>

                  <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">
                      Total
                    </span>
                    <span className="text-2xl font-bold tracking-tight">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Código de promoción */}
                <div className="mb-10">
                  <label
                    className="block text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-4"
                    htmlFor="promo"
                  >
                    Código de Promoción
                  </label>
                  <div className="flex gap-0">
                    <input
                      className="flex-1 bg-white dark:bg-background-dark border border-zinc-200 dark:border-zinc-800 text-[10px] tracking-widest focus:ring-1 focus:ring-primary py-3.5 px-4"
                      id="promo"
                      placeholder="CÓDIGO"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button className="px-6 bg-primary text-white hover:bg-primary/80 transition-all duration-300 text-[9px] uppercase font-bold tracking-widest cursor-pointer">
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Botón finalizar compra */}
                <button className="w-full bg-white dark:bg-white text-black py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-200 transition-colors mb-8 cursor-pointer">
                  Finalizar compra
                </button>

                {/* Info adicional */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.15em] text-zinc-500">
                    <span className="material-symbols-outlined text-lg">
                      verified_user
                    </span>
                    <span>Pago 100% Seguro y Encriptado</span>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.15em] text-zinc-500">
                    <span className="material-symbols-outlined text-lg">
                      local_shipping
                    </span>
                    <span>Envío gratis en pedidos +$600,000 COP</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </PublicLayout>
  );
};

export default CartPage;
