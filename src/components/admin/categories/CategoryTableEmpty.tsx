interface CategoryTableEmptyProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export default function CategoryTableEmpty({
  searchQuery,
  onClearSearch,
}: CategoryTableEmptyProps) {
  return (
    <tr>
      <td colSpan={3} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-neutral-400">
              {searchQuery ? "search_off" : "category"}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
              {searchQuery
                ? "No se encontraron categorías"
                : "No hay categorías registradas"}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {searchQuery
                ? "Intenta con otros términos de búsqueda"
                : "Crea tu primera categoría para comenzar"}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
