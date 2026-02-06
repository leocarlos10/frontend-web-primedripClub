import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/admin/layout";
import type { ProductBase, ProductFormData } from "../../types/product";
import {
  cargarProductos,
  cargarCategorias,
  getStatusDisplay,
  getStockColor,
} from "../../utils/InventarioPageUtils";
import {
  ProductTableRow,
  ProductTableSkeleton,
  ProductTableError,
  ProductTableEmpty,
  ProductFormDialog,
  CategoryTableRow,
  CategoryTableSkeleton,
  CategoryTableError,
  CategoryTableEmpty,
  CategoryFormDialog,
} from "../../components/admin";
import { useProducto } from "../../hooks/useProducto";
import { useCategoria } from "../../hooks/useCategoria";
import type { ProductoRequest } from "../../types/requestType/producto/ProductoRequest";
import type { CategoriaRequest } from "../../types/requestType/categoria/CategoriaRequest";
import { useToast } from "../../hooks/useToast";
import type { Response } from "../../types/requestType/common/Response";
import type { ProductoResponse } from "../../types/requestType/producto/ProductoResponse";
import type { CategoriaResponse } from "../../types/requestType/categoria/CategoriaResponse";
import type { ErrorResponse } from "../../types/requestType/common/ErrorResponse";
import type { ProductUpdateData } from "../../types/product";
import { Button } from "../../components";
import type { TabType } from "../../types/TabType/TabType";


export default function InventarioPage() {
  const [activeTab, setActiveTab] = useState<TabType>("products");

  // Estados para productos
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductBase | null>(
    null,
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  // Estados para categorías
  const [categories, setCategories] = useState<CategoriaResponse[]>([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoriaResponse | null>(null);
  const [categoryDialogMode, setCategoryDialogMode] = useState<
    "create" | "edit"
  >("create");

  // uso del context para producto
  const {
    guardarProducto,
    obtenerProductos,
    actualizarProductos,
    eliminarProducto,
  } = useProducto();

  // uso del context para categoría
  const {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useCategoria();

  /* 
    manejo del estado de carga y aviso(toast)
    para las entidades del inventario
  */
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    cargarProductos({
      obtenerProductos,
      setProducts,
      setIsLoading,
      setError,
      showToast,
    });
    cargarCategorias({
      obtenerCategorias,
      setCategories,
      setIsCategoryLoading,
      setCategoryError,
      showToast,
    });
  }, []);

  // Función de filtrado de productos
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.nombre.toLowerCase().includes(query) ||
      product.marca.toLowerCase().includes(query) ||
      product.precio.toString().includes(query)
    );
  });

  // Función de filtrado de categorías
  const filteredCategories = categories.filter((category) => {
    const query = categorySearchQuery.toLowerCase();
    return (
      category.nombre.toLowerCase().includes(query) ||
      category.descripcion.toLowerCase().includes(query)
    );
  });

  // Funciones para productos
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

  // Funciones para categorías
  const handleEditCategory = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setEditingCategory(category);
      setCategoryDialogMode("edit");
      setIsCategoryDialogOpen(true);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    // antes de eliminar la categoría, verificamos si hay productos asignados a ella
    const productosConCategoria = products.filter(
      (prod) => prod.categoriaId === id,
    );
    /* en caso de que haya productos asignados, 
    no se permite eliminar la categoría 
    y se muestra un mensaje de error 
    indicando cuántos productos están asignados a esa categoría 
    */
    if (productosConCategoria.length > 0) {
      showToast(
        `No se puede eliminar la categoría porque está asignada a ${productosConCategoria.length} producto(s)`,
        "error",
      );
      return;
    }

    const respuesta = await eliminarCategoria(id);

    if (respuesta.success) {
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id),
      );
      showToast((respuesta as Response<boolean>).message, "success");
    } else {
      showToast((respuesta as ErrorResponse).message, "error");
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryDialogMode("create");
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async (categoryData: CategoriaRequest) => {
    if (categoryDialogMode === "create") {
      const respuesta = await crearCategoria(categoryData);

      if (respuesta.success) {
        setCategories([
          ...categories,
          (respuesta as Response<CategoriaResponse>).data,
        ]);
        showToast(
          (respuesta as Response<CategoriaResponse>).message,
          "success",
        );
        setIsCategoryDialogOpen(false);
      } else {
        showToast((respuesta as ErrorResponse).message, "error");
      }
    } else if (categoryDialogMode === "edit" && editingCategory) {
      const respuesta = await actualizarCategoria(
        editingCategory.id,
        categoryData,
      );

      if (respuesta.success) {
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === editingCategory.id
              ? (respuesta as Response<CategoriaResponse>).data
              : cat,
          ),
        );
        showToast(
          (respuesta as Response<CategoriaResponse>).message,
          "success",
        );
        setIsCategoryDialogOpen(false);
      } else {
        showToast((respuesta as ErrorResponse).message, "error");
      }
    }
  };

  return (
    <AdminLayout title="Inventario">
      <div className="space-y-6">
        {/* Descripción */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">
            Gestión de Inventario
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Gestiona productos, categorías y organiza tu inventario.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-zinc-800">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("products")}
              className={`relative px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "products"
                  ? "text-primary"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  inventory_2
                </span>
                Productos
              </span>
              {activeTab === "products" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`relative px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "categories"
                  ? "text-primary"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">
                  category
                </span>
                Categorías
              </span>
              {activeTab === "categories" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Contenido de Productos */}
        {activeTab === "products" && (
          <>
            {/* Header con búsqueda y botón crear */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none dark:text-white"
                  />
                </div>
              </div>

              <Button onClick={handleCreateProduct}>
                <span className="material-symbols-outlined text-lg">add</span>
                Crear producto
              </Button>
            </div>

            {/* Tabla de productos */}
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
                        Categoría
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
                  <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
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
                          categories={categories}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          getStockColor={getStockColor}
                          getStatusDisplay={getStatusDisplay}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/50">
                <p className="text-sm text-neutral-500">
                  {products.length} producto{products.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Contenido de Categorías */}
        {activeTab === "categories" && (
          <>
            {/* Header con búsqueda y botón crear */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar categorías..."
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none dark:text-white"
                  />
                </div>
              </div>

              <Button onClick={handleCreateCategory}>
                <span className="material-symbols-outlined text-lg">add</span>
                Crear categoría
              </Button>
            </div>

            {/* Tabla de categorías */}
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto hide-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-neutral-50 dark:bg-zinc-800 z-10">
                    <tr className="border-b border-neutral-200 dark:border-zinc-800">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                        Categoría
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                        Descripción
                      </th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500 text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-zinc-800">
                    {isCategoryLoading && <CategoryTableSkeleton />}
                    {categoryError && <CategoryTableError />}
                    {!isCategoryLoading &&
                      !categoryError &&
                      filteredCategories.length === 0 && (
                        <CategoryTableEmpty
                          searchQuery={categorySearchQuery}
                          onClearSearch={() => setCategorySearchQuery("")}
                        />
                      )}
                    {!isCategoryLoading &&
                      !categoryError &&
                      filteredCategories.map((category) => (
                        <CategoryTableRow
                          key={category.id}
                          category={category}
                          onEdit={handleEditCategory}
                          onDelete={handleDeleteCategory}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/50">
                <p className="text-sm text-neutral-500">
                  {categories.length} categoría
                  {categories.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      <ProductFormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        mode={dialogMode}
      />

      <CategoryFormDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
        mode={categoryDialogMode}
      />
    </AdminLayout>
  );
}
