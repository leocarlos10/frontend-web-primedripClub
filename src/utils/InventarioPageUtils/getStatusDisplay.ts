export const getStatusDisplay = (activo: boolean, stock: number) => {
  if (!activo) {
    return {
      label: "Inactivo",
      color:
        "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500",
    };
  }
  if (stock <= 5 && stock > 0) {
    return {
      label: "Bajo Stock",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    };
  }
  if (stock === 0) {
    return {
      label: "Sin Stock",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
  }
  return {
    label: "Activo",
    color:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  };
};
