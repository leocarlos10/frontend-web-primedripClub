import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/layout";
import type { ProductBase, ProductFormData } from "../../types/product";
import {
  ProductTableRow,
  ProductTableSkeleton,
  ProductTableError,
  ProductTableEmpty,
  ProductFormDialog,
} from "../../components/admin";
import { useProducto } from "../../hooks/useProducto";
import type { ProductoRequest } from "../../types/requestType/producto/ProductoRequest";
import { useToast } from "../../hooks/useToast";
import type { Response } from "../../types/requestType/common/Response";
import type { ProductoResponse } from "../../types/requestType/producto/ProductoResponse";
import type { ErrorResponse } from "../../types/requestType/common/ErrorResponse";
import type { ProductUpdateData } from "../../types/product";

export default function ProductosPage() {
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductBase | null>(
    null,
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const { guardarProducto, obtenerProductos, actualizarProductos, eliminarProducto } =
    useProducto();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const respuesta = await obtenerProductos();

      if (respuesta.success) {
        setProducts((respuesta as Response<ProductoResponse[]>).data);
      } else {
        setError(true);
        showToast("Error al cargar productos", "error");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError(true);
      showToast("Error al cargar productos", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Función de filtrado
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.nombre.toLowerCase().includes(query) ||
      product.marca.toLowerCase().includes(query) ||
      product.precio.toString().includes(query)
    );
  });

  const getStatusDisplay = (activo: boolean, stock: number) => {
    if (!activo) {
      return {
        label: "Inactivo",
        color:
          "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500",
      };
    }
    if (stock <= 5 && stock > 0) {
      return {
        label: "Bajo Stock",
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      };
    }
    if (stock === 0) {
      return {
        label: "Sin Stock",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      };
    }
    return {
      label: "Activo",
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
  };

  const getStockColor = (stock: number) => {
    if (stock === 0)
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 font-medium";
    if (stock <= 5)
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 font-medium";
    return "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200";
  };

  const handleEdit = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setEditingProduct(product);
      setDialogMode("edit");
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    console.log("Eliminar producto:", id);
    const respuesta = await eliminarProducto(id);

    if (respuesta.success) {
      setProducts((prevProducts) =>
        prevProducts.filter((prod) => prod.id !== id),
      );
      showToast((respuesta as Response<boolean>).message, "success");
    } else {
      showToast((respuesta as ErrorResponse).message, "error");
    }

  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const handleSaveProduct = async (productData: ProductFormData) => {
    if (dialogMode === "create") {
      // Crear nuevo producto
      const newProduct: ProductoRequest = {
        ...productData,
      };
      console.log("Crear producto:", newProduct);
      const respuesta = await guardarProducto(newProduct);

      if (respuesta.success) {
        setProducts([
          ...products,
          (respuesta as Response<ProductoResponse>).data,
        ]);
        showToast((respuesta as Response<ProductoResponse>).message, "success");
        setIsDialogOpen(false);
      } else {
        showToast((respuesta as ErrorResponse).message, "error");
      }
    } else if (dialogMode === "edit" && editingProduct) {
      // Actualizar producto existente
      // creamos un nuevo producto de tipo ProductUpdateData
      const updatedProduct: ProductUpdateData = {
        id: editingProduct.id,
        ...productData,
      };

      console.log("Actualizar producto:", updatedProduct);
      const respuesta = await actualizarProductos(updatedProduct);

      if (respuesta.success) {
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.id === updatedProduct.id
              ? (respuesta as Response<ProductoResponse>).data
              : prod,
          ),
        );
        showToast((respuesta as Response<ProductoResponse>).message, "success");
        setIsDialogOpen(false);
      } else {
        showToast((respuesta as ErrorResponse).message, "error");
      }
    }
  };

  return (
    <AdminLayout title="Productos">
      <div className="space-y-6">
        {/* Header con búsqueda y botón crear */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar en el catálogo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCreateProduct}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Crear producto
          </button>
        </div>

        {/* Descripción */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Gestión de Productos
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Catálogo de Productos: Gestiona precios, niveles de stock y estado
            del catálogo.
          </p>
        </div>

        {/* Tabla con scroll */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto hide-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-neutral-50 dark:bg-zinc-800 z-10">
                <tr className="border-b border-neutral-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Marca
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Etiqueta
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Sexo
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800 ">
                {isLoading && <ProductTableSkeleton />}

                {error && <ProductTableError />}

                {!isLoading && !error && filteredProducts.length === 0 && (
                  <ProductTableEmpty
                    searchQuery={searchQuery}
                    onClearSearch={() => setSearchQuery("")}
                  />
                )}

                {!isLoading &&
                  !error &&
                  filteredProducts.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      id={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      getStockColor={getStockColor}
                      getStatusDisplay={getStatusDisplay}
                    />
                  ))}
              </tbody>
            </table>
          </div>

          {/* Footer con contador */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/50">
            <p className="text-sm text-neutral-500">
              cantidad de productos {products.length}
            </p>
          </div>
        </div>
      </div>

      {/* Dialog de Formulario */}
      <ProductFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        mode={dialogMode}
      />
    </AdminLayout>
  );
}
