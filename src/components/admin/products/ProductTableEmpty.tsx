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
      <td colSpan={8} className="px-6 py-20">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-neutral-400 dark:text-neutral-600">
              inventory_2
            </span>
          </div>
          <div>
            <p className="text-neutral-900 dark:text-white font-bold text-xl mb-2">
              No se encontraron productos
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-md mx-auto">
              {searchQuery
                ? `No hay resultados para "${searchQuery}"`
                : "No hay productos registrados en el catálogo"}
            </p>
          </div>
          {searchQuery && onClearSearch && (
            <button
              onClick={onClearSearch}
              className="mt-2 px-6 py-2.5 bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white rounded-lg text-sm font-medium hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
