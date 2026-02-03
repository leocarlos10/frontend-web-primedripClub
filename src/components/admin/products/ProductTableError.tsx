interface ProductTableErrorProps {
  onRetry?: () => void;
}

export default function ProductTableError({ onRetry }: ProductTableErrorProps) {
  return (
    <tr>
      <td colSpan={6} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
              error
            </span>
          </div>
          <div>
            <p className="text-neutral-900 dark:text-white font-semibold text-lg mb-1">
              Error al cargar productos
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              No se pudieron obtener los datos. Intenta nuevamente.
            </p>
          </div>
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="mt-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </td>
    </tr>
  );
}
