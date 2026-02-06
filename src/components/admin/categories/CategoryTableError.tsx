export default function CategoryTableError() {
  return (
    <tr>
      <td colSpan={3} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
              error
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
              Error al cargar las categorías
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Ocurrió un problema al intentar cargar los datos
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}
