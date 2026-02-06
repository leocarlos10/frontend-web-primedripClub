export default function CategoryTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-200 dark:bg-zinc-800" />
              <div className="h-5 w-32 bg-neutral-200 dark:bg-zinc-800 rounded" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="space-y-2">
              <div className="h-4 w-64 bg-neutral-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-48 bg-neutral-200 dark:bg-zinc-800 rounded" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center justify-end gap-2">
              <div className="h-8 w-8 bg-neutral-200 dark:bg-zinc-800 rounded-lg" />
              <div className="h-8 w-8 bg-neutral-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
