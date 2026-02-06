import type { CategoriaResponse } from "../../../types/requestType/categoria/CategoriaResponse";

interface CategoryTableRowProps {
  category: CategoriaResponse;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CategoryTableRow({
  category,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  return (
    <tr className="group hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">
              category
            </span>
          </div>
          <div>
            <p className="font-medium text-neutral-900 dark:text-white">
              {category.nombre}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {category.descripcion}
        </p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category.id)}
            className=" flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
            title="Editar categoría"
          >
            <span className="material-symbols-outlined text-lg text-neutral-600 dark:text-neutral-400">
              edit
            </span>
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="flex items-center p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
            title="Eliminar categoría"
          >
            <span className="material-symbols-outlined text-lg text-red-600 dark:text-red-400">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}
