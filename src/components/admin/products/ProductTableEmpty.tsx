interface ProductTableEmptyProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export default function ProductTableEmpty({
  searchQuery,
  onClearSearch,
}: ProductTableEmptyProps) {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-neutral-400">
              inventory_2
            </span>
          </div>
          <div>
            <p className="text-neutral-900 dark:text-white font-semibold text-lg mb-1">
              No se encontraron productos
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              {searchQuery
                ? `No hay resultados para "${searchQuery}"`
                : "No hay productos registrados en el catálogo"}
            </p>
          </div>
          {searchQuery && onClearSearch && (
            <button
              onClick={onClearSearch}
              className="mt-2 px-4 py-2 bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
