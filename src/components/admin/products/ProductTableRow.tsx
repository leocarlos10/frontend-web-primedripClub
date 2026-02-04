import { url_backend_image } from "../../../Config";
import type { ProductTableRowProps } from "../../../types/TypeProps/ProductTableRowProps";

function ProductTableRow(props: ProductTableRowProps) {
  const { product, id, onEdit, onDelete, getStockColor, getStatusDisplay } = props;
  const statusInfo = getStatusDisplay(product.activo, product.stock);

  return (
    <tr
      key={id}
      className="group hover:bg-neutral-50 dark:hover:bg-zinc-800/50 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
            <img
              src={`${url_backend_image}${product.imagenUrl}`}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-sm dark:text-white">
              {product.nombre}
            </p>
            <p className="text-xs text-neutral-500">ID: {product.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
        {product.marca}
      </td>
      <td className="px-6 py-4 text-sm font-medium dark:text-white">
        {product.precio.toFixed(2)}€
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`px-2.5 py-1 rounded ${getStockColor(product.stock)}`}>
          {product.stock} unidades
        </span>
      </td>
      <td className="px-6 py-4">
        {(product as any).etiqueta ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
            {(product as any).etiqueta}
          </span>
        ) : (
          <span className="text-xs text-neutral-400 dark:text-neutral-600 italic">
            Sin etiqueta
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {(product as any).sexo ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
            {(product as any).sexo}
          </span>
        ) : (
          <span className="text-xs text-neutral-400 dark:text-neutral-600 italic">
            No especificado
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product.id)}
            className="flex items-center p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors cursor-pointer"
            title="Editar"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex items-center p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded transition-colors cursor-pointer"
            title="Eliminar"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ProductTableRow;
