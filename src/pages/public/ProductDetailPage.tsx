import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProductosActivos } from "../../hooks/useProductosActivos";
import { useCategoria } from "../../hooks/useCategoria";
import { useToast } from "../../hooks/useToast";
import type { CatalogProduct } from "../../types/product";
import type { CategoriaResponse } from "../../types/requestType/categoria/CategoriaResponse";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { url_backend_image } from "../../Config";
import { PublicLayout } from "../../components";

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { productos, isLoading } = useProductosActivos();
  const { obtenerCategorias } = useCategoria();
  const { showToast } = useToast();

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [category, setCategory] = useState<CategoriaResponse | null>(null);
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Secciones desplegables
  const [openSections, setOpenSections] = useState({
    description: true,
    materials: false,
    shipping: false,
  });

  // Cargar categorías
  useEffect(() => {
    const loadCategorias = async () => {
      const result = await obtenerCategorias();
      if (result.success && "data" in result && result.data) {
        setCategorias(result.data);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    // Esperar a que los productos se carguen
    if (isLoading) {
      return;
    }

    if (!id) {
      navigate("/catalogo");
      return;
    }

    const productId = parseInt(id);
    const foundProduct = productos.find(
      (p: CatalogProduct) => p.id === productId,
    );

    if (foundProduct) {
      setProduct(foundProduct as CatalogProduct);
      setSelectedImage(foundProduct.imagenUrl);

      const foundCategory = categorias.find(
        (c: CategoriaResponse) => c.id === foundProduct.categoriaId,
      );
      setCategory(foundCategory || null);
      setLoading(false);
    } else if (productos.length > 0) {
      // Solo mostrar error si ya se cargaron los productos y no se encontró
      showToast("Producto no encontrado", "error");
      navigate("/catalogo");
    }
  }, [id, productos, categorias, isLoading]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      showToast("Producto agotado", "error");
      return;
    }

    if (quantity > product.stock) {
      showToast(`Solo hay ${product.stock} unidades disponibles`, "error");
      return;
    }

    // TODO: Implementar lógica de carrito
    showToast(`${quantity} unidad(es) agregadas al carrito`, "success");
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (product.stock === 0) {
      showToast("Producto agotado", "error");
      return;
    }

    if (quantity > product.stock) {
      showToast(`Solo hay ${product.stock} unidades disponibles`, "error");
      return;
    }

    // TODO: Implementar lógica de compra directa
    showToast("Redirigiendo a checkout...", "info");
  };

  // condicional de carga
  if (loading || isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return null;
  }

  const isOutOfStock = product.stock === 0;

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs mb-8 text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          <button
            onClick={() => navigate("/")}
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Inicio
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/catalogo")}
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Catálogo
          </button>
          <span>/</span>
          {category && (
            <>
              <span className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                {category.nombre}
              </span>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-900 dark:text-white">
            {product.nombre}
          </span>
        </nav>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-hidden">
              <img
                src={`${url_backend_image}${selectedImage}`}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
              {product.etiqueta && (
                <span className="absolute top-4 left-4 bg-primary text-white px-2 py-1 text-[10px] font-bold uppercase tracking-tighter">
                  {product.etiqueta}
                </span>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Título */}
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-3">
                {product.nombre}
              </h1>
              <p className="text-2xl font-bold">
                {product.precio.toLocaleString("es-CO", {
                  minimumFractionDigits: 0,
                })}{" "}
                <span className="text-xs text-zinc-500">COP</span>
              </p>
            </div>

            {/* Información adicional */}
            <div className="space-y-2 text-xs uppercase tracking-wide">
              {product.marca && (
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Marca:
                  </span>
                  <span className="font-medium">{product.marca}</span>
                </div>
              )}
              {category && (
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Categoría:
                  </span>
                  <span className="font-medium">{category.nombre}</span>
                </div>
              )}
              {product.sexo && (
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Género:
                  </span>
                  <span className="font-medium">{product.sexo}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Disponibilidad:
                </span>
                <span
                  className={`font-bold ${
                    isOutOfStock
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {isOutOfStock ? "Agotado" : `${product.stock} unidades`}
                </span>
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3">
                Cantidad
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="w-12 h-12 border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= product.stock) {
                      setQuantity(value);
                    }
                  }}
                  disabled={isOutOfStock}
                  className="w-20 h-12 text-center border border-zinc-300 dark:border-zinc-600 bg-transparent font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="w-12 h-12 border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-bold py-4 px-6 transition-colors disabled:cursor-not-allowed uppercase text-xs tracking-widest"
              >
                {isOutOfStock ? "Agotado" : "Agregar al carrito"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white dark:text-zinc-900 font-bold py-4 px-6 transition-colors disabled:cursor-not-allowed uppercase text-xs tracking-widest"
              >
                {isOutOfStock ? "No disponible" : "Comprar ahora"}
              </button>
            </div>

            {/* Secciones desplegables */}
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 space-y-4">
              {/* Descripción */}
              <div className="border-b border-zinc-200 dark:border-zinc-700 pb-4">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Descripción
                  </span>
                  <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">
                    {openSections.description
                      ? "keyboard_arrow_up"
                      : "keyboard_arrow_down"}
                  </span>
                </button>
                {openSections.description && (
                  <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <p>{product.descripcion}</p>
                  </div>
                )}
              </div>

              {/* Materiales & Cuidado */}
              <div className="border-b border-zinc-200 dark:border-zinc-700 pb-4">
                <button
                  onClick={() => toggleSection("materials")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Materiales & Cuidado
                  </span>
                  <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">
                    {openSections.materials
                      ? "keyboard_arrow_up"
                      : "keyboard_arrow_down"}
                  </span>
                </button>
                {openSections.materials && (
                  <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                    <p>• Materiales de alta calidad para mayor durabilidad</p>
                    <p>• Lavar a máquina en ciclo suave</p>
                    <p>• No usar blanqueador</p>
                    <p>• Secar a temperatura baja</p>
                  </div>
                )}
              </div>

              {/* Envío & Devoluciones */}
              <div className="border-b border-zinc-200 dark:border-zinc-700 pb-4">
                <button
                  onClick={() => toggleSection("shipping")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Envío & Devoluciones
                  </span>
                  <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">
                    {openSections.shipping
                      ? "keyboard_arrow_up"
                      : "keyboard_arrow_down"}
                  </span>
                </button>
                {openSections.shipping && (
                  <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                    <p>• Envío gratis en pedidos superiores a $100,000 COP</p>
                    <p>• Entrega en 3-5 días hábiles</p>
                    <p>• Devoluciones gratuitas dentro de 30 días</p>
                    <p>• El producto debe estar sin usar y con etiquetas</p>
                  </div>
                )}
              </div>

              {/* Badges de confianza */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-green-600 text-xl">
                    verified
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium">
                    Autenticidad
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-green-600 text-xl">
                    eco
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wide font-medium">
                    Sostenible
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
