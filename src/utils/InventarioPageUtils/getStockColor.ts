export const getStockColor = (stock: number) => {
  if (stock === 0)
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 font-medium";
  if (stock <= 5)
    return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 font-medium";
  return "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200";
};
