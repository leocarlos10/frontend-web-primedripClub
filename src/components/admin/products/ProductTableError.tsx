interface ProductTableErrorProps {
  onRetry?: () => void;
}

export default function ProductTableError({ onRetry }: ProductTableErrorProps) {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-20">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-red-600 dark:text-red-400">
              error
            </span>
          </div>
          <div>
            <p className="text-neutral-900 dark:text-white font-bold text-xl mb-2">
              Error al cargar productos
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-md mx-auto">
              No se pudieron obtener los datos. Intenta nuevamente.
            </p>
          </div>
          <button
            onClick={onRetry || (() => window.location.reload())}
            className="mt-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </td>
    </tr>
  );
}
