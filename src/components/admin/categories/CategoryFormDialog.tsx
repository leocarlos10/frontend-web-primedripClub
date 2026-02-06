import { useState, useEffect } from "react";
import type { CategoriaResponse } from "../../../types/requestType/categoria/CategoriaResponse";
import type { CategoriaRequest } from "../../../types/requestType/categoria/CategoriaRequest";

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoriaRequest) => void;
  category: CategoriaResponse | null;
  mode: "create" | "edit";
}

export default function CategoryFormDialog({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}: CategoryFormDialogProps) {

  const [formData, setFormData] = useState<CategoriaRequest>({
    nombre: "",
    descripcion: "",
  });

  const [errors, setErrors] = useState<{
    nombre?: string;
    descripcion?: string;
  }>({});

  useEffect(() => {
    if (isOpen && mode === "edit" && category) {
      setFormData({
        nombre: category.nombre,
        descripcion: category.descripcion,
      });
    } else if (isOpen && mode === "create") {
      setFormData({
        nombre: "",
        descripcion: "",
      });
    }
    setErrors({});
  }, [isOpen, mode, category]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = "El nombre no puede exceder 100 caracteres";
    }

    if (formData.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no puede exceder 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-neutral-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {mode === "create" ? "Nueva Categoría" : "Editar Categoría"}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {mode === "create"
                ? "Completa la información para crear una nueva categoría"
                : "Actualiza la información de la categoría"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-neutral-600 dark:text-neutral-400">
              close
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-zinc-800 border ${
                errors.nombre
                  ? "border-red-500 dark:border-red-500"
                  : "border-neutral-200 dark:border-zinc-700"
              } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none dark:text-white`}
              placeholder="Ej: Perfumes, Relojes, Accesorios"
              maxLength={100}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.nombre ? (
                <p className="text-xs text-red-500">{errors.nombre}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Máximo 100 caracteres
                </p>
              )}
              <p className="text-xs text-neutral-400">
                {formData.nombre.length}/100
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2.5 bg-neutral-50 dark:bg-zinc-800 border ${
                errors.descripcion
                  ? "border-red-500 dark:border-red-500"
                  : "border-neutral-200 dark:border-zinc-700"
              } rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none dark:text-white`}
              placeholder="Describe esta categoría (opcional)"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-1.5">
              {errors.descripcion ? (
                <p className="text-xs text-red-500">{errors.descripcion}</p>
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Máximo 500 caracteres
                </p>
              )}
              <p className="text-xs text-neutral-400">
                {formData.descripcion.length}/500
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">
                {mode === "create" ? "add" : "save"}
              </span>
              {mode === "create" ? "Crear categoría" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
