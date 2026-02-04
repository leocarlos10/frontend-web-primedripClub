import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { saveImage } from "../../../utils/uploadImage";
import type { ProductFormData } from "../../../types/product";
import type { ProductFormDialogProps } from "../../../types/TypeProps/ProductFormDialogProps";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import { useCategoria } from "../../../hooks/useCategoria";
import type { CategoriaResponse } from "../../../types/requestType/categoria/CategoriaResponse";
import type { Response } from "../../../types/requestType/common/Response";
import { url_backend_image } from "../../../Config";

export default function ProductFormDialog({
  isOpen,
  onClose,
  onSave,
  product,
  mode,
}: ProductFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const { obtenerCategorias } = useCategoria();

  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    marca: "",
    imagenUrl: "",
    activo: true,
    categoriaId: 0,
    etiqueta: null,
    sexo: null,
    isFeatured: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});

  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      cargarCategorias();
      // Cargar datos del producto si está en modo edición
      if (product && mode === "edit") {
        setFormData({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          stock: product.stock,
          marca: product.marca,
          imagenUrl: product.imagenUrl,
          activo: product.activo,
          categoriaId: product.categoriaId,
          etiqueta: (product as any).etiqueta || null,
          sexo: (product as any).sexo || null,
          isFeatured: (product as any).isFeatured || false,
        });
        setImagePreview(`${url_backend_image}${product.imagenUrl}`);
      } else {
        resetForm();
      }
    } else {
      dialog.close();
      resetForm();
    }
  }, [isOpen, product, mode]);

  const cargarCategorias = async () => {
    try {
      setLoadingCategorias(true);
      const respuesta = await obtenerCategorias();

      if (respuesta.success) {
        setCategorias((respuesta as Response<CategoriaResponse[]>).data);
      } else {
        showToast("Error al cargar categorías", "error");
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      showToast("Error al cargar categorías", "error");
    } finally {
      setLoadingCategorias(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      marca: "",
      imagenUrl: "",
      activo: true,
      categoriaId: 0,
      etiqueta: null,
      sexo: null,
      isFeatured: false,
    });
    setErrors({});
    setImagePreview("");
    setSelectedFile(null);

    // Resetear el input de archivo
    const fileInput = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, imagenUrl: "El archivo debe ser una imagen" });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, imagenUrl: "La imagen debe ser menor a 5MB" });
        return;
      }

      setSelectedFile(file);

      // Crear preview inmediatamente
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Guardar imagen y obtener URL
      try {
        const url = await saveImage(
          file,
          isAuthenticated,
          user ? user : ({} as any),
        );
        if (url !== undefined) {
          setFormData((prev) => ({ ...prev, imagenUrl: url }));
        } else {
          showToast(
            " No se puedo subir la imagen, intente mas tarde.",
            "error",
          );
        }

        // Limpiar error de imagen si existía
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.imagenUrl;
          return newErrors;
        });
      } catch (error) {
        console.error("Error al guardar imagen:", error);
        setErrors((prev) => ({
          ...prev,
          imagenUrl: "Error al procesar la imagen",
        }));
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, imagenUrl: "" }));

    // Resetear el input de archivo
    const fileInput = document.getElementById(
      "image-upload",
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }
    if (formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }
    if (formData.stock < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }
    if (!formData.marca.trim()) {
      newErrors.marca = "La marca es requerida";
    }
    if (!formData.categoriaId || formData.categoriaId === 0) {
      newErrors.categoriaId = "La categoría es requerida";
    }
    if (!formData.imagenUrl.trim()) {
      newErrors.imagenUrl = "La URL de la imagen es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      resetForm();
      onClose();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      className="backdrop:bg-black/50 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-0 m-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-neutral-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold dark:text-white">
          {mode === "create" ? "Crear Nuevo Producto" : "Editar Producto"}
        </h2>
        <button
          onClick={handleCancel}
          type="button"
          className="text-neutral-400 hover:text-neutral-600 
          dark:hover:text-neutral-300 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Nombre del Producto *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            className={`w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border ${
              errors.nombre
                ? "border-red-500"
                : "border-neutral-200 dark:border-zinc-700"
            } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white`}
            placeholder="Ej: Reloj Premium"
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Descripción *
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            rows={3}
            className={`w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border ${
              errors.descripcion
                ? "border-red-500"
                : "border-neutral-200 dark:border-zinc-700"
            } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none dark:text-white`}
            placeholder="Describe el producto..."
          />
          {errors.descripcion && (
            <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>
          )}
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Precio (COP) *
            </label>
            <input
              type="number"
              step="1"
              value={formData.precio || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precio:
                    e.target.value === "" ? 0 : parseFloat(e.target.value),
                })
              }
              className={`w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border ${
                errors.precio
                  ? "border-red-500"
                  : "border-neutral-200 dark:border-zinc-700"
              } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white`}
              placeholder="0"
            />
            {errors.precio && (
              <p className="text-red-500 text-xs mt-1">{errors.precio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Stock *
            </label>
            <input
              type="number"
              value={formData.stock || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value === "" ? 0 : parseInt(e.target.value),
                })
              }
              className={`w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border ${
                errors.stock
                  ? "border-red-500"
                  : "border-neutral-200 dark:border-zinc-700"
              } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white`}
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Marca y Categoría */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Marca *
            </label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
              className={`w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border ${
                errors.marca
                  ? "border-red-500"
                  : "border-neutral-200 dark:border-zinc-700"
              } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white`}
              placeholder="Ej: Nike"
            />
            {errors.marca && (
              <p className="text-red-500 text-xs mt-1">{errors.marca}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Categoría *
            </label>
            <select
              value={formData.categoriaId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoriaId: parseInt(e.target.value),
                })
              }
              disabled={loadingCategorias}
              className={`w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border ${
                errors.categoriaId
                  ? "border-red-500"
                  : "border-neutral-200 dark:border-zinc-700"
              } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="0">
                {loadingCategorias ? "Cargando..." : "Seleccionar categoría"}
              </option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <p className="text-red-500 text-xs mt-1">{errors.categoriaId}</p>
            )}
          </div>
        </div>

        {/* URL de Imagen */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Imagen del Producto *
          </label>
          <div className="space-y-3">
            {/* Preview de la imagen */}
            {imagePreview && (
              <div className=" flex items-center space-x-2">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-zinc-700">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Botón para eliminar imagen */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  title="eliminar imagen"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 
                  text-white text-xs font-medium rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                </button>
              </div>
            )}

            {/* Input de archivo */}
            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 bg-neutral-50 dark:bg-zinc-800 border ${
                  errors.imagenUrl
                    ? "border-red-500"
                    : "border-neutral-200 dark:border-zinc-700"
                } rounded-lg text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-700 transition-colors`}
              >
                <span className="material-symbols-outlined text-neutral-500 dark:text-neutral-400">
                  upload
                </span>
                <span className="text-neutral-700 dark:text-neutral-300">
                  {selectedFile ? selectedFile.name : "Seleccionar imagen"}
                </span>
              </label>
            </div>

            {errors.imagenUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.imagenUrl}</p>
            )}

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Formatos permitidos: JPG, PNG, GIF. Máximo 5MB.
            </p>
          </div>
        </div>

        {/* Etiqueta y Sexo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Etiqueta (Opcional)
            </label>
            <select
              value={formData.etiqueta || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  etiqueta:
                    e.target.value === "" ? null : (e.target.value as any),
                })
              }
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border
               border-neutral-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2
                focus:ring-primary focus:border-transparent outline-none transition-all 
                dark:text-white cursor-pointer"
            >
              <option value="">Sin etiqueta</option>
              <option value="Agotado">Agotado</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Oferta">Oferta</option>
              <option value="Destacado">Destacado</option>
              <option value="Últimas unidades">Últimas unidades</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Sexo/Género (Opcional)
            </label>
            <select
              value={formData.sexo || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sexo: e.target.value === "" ? null : (e.target.value as any),
                })
              }
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-zinc-800 border
               border-neutral-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2
                focus:ring-primary focus:border-transparent outline-none transition-all 
                dark:text-white cursor-pointer"
            >
              <option value="">Seleccionar</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Niño">Niño</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Estado Activo y Producto Destacado */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) =>
                setFormData({ ...formData, activo: e.target.checked })
              }
              className="w-4 h-4 text-primary bg-neutral-100 border-neutral-300 rounded 
              focus:ring-primary dark:bg-zinc-800 dark:border-zinc-700 cursor-pointer"
            />
            <label
              htmlFor="activo"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Producto activo
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured || false}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="w-4 h-4 text-primary bg-neutral-100 border-neutral-300 rounded 
              focus:ring-primary dark:bg-zinc-800 dark:border-zinc-700 cursor-pointer"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Producto destacado
            </label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 
            hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-bold bg-black dark:bg-white text-white 
            dark:text-black rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            {mode === "create" ? "Crear Producto" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
