export default function ProductTableSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <tr
          key={i}
          className="border-b border-neutral-100 dark:border-zinc-800 animate-pulse"
        >
          {/* Producto */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-neutral-200 dark:bg-zinc-800"></div>
              <div className="flex-1">
                <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-neutral-200 dark:bg-zinc-800 rounded w-1/4"></div>
              </div>
            </div>
          </td>
          {/* Marca */}
          <td className="px-6 py-4">
            <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-20"></div>
          </td>
          {/* Precio */}
          <td className="px-6 py-4">
            <div className="h-4 bg-neutral-200 dark:bg-zinc-800 rounded w-16"></div>
          </td>
          {/* Stock */}
          <td className="px-6 py-4">
            <div className="h-6 bg-neutral-200 dark:bg-zinc-800 rounded w-24"></div>
          </td>
          {/* Etiqueta */}
          <td className="px-6 py-4">
            <div className="h-6 bg-neutral-200 dark:bg-zinc-800 rounded-full w-20"></div>
          </td>
          {/* Sexo */}
          <td className="px-6 py-4">
            <div className="h-6 bg-neutral-200 dark:bg-zinc-800 rounded-full w-20"></div>
          </td>
          {/* Estado */}
          <td className="px-6 py-4">
            <div className="h-6 bg-neutral-200 dark:bg-zinc-800 rounded-full w-20"></div>
          </td>
          {/* Acciones */}
          <td className="px-6 py-4 text-right">
            <div className="flex items-center justify-end gap-2">
              <div className="w-8 h-8 bg-neutral-200 dark:bg-zinc-800 rounded"></div>
              <div className="w-8 h-8 bg-neutral-200 dark:bg-zinc-800 rounded"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
