import type { Toast } from "../../types/Toast";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: number) => void;
}

export default function ToastItem({ toast, onRemove }: ToastItemProps) {
  
    const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      case "warning":
        return "bg-yellow-600 text-white";
      default:
        return "bg-zinc-900 dark:bg-white text-white dark:text-black";
    }
  };

  return (
    <div
      className={`
        min-w-75 p-4 rounded-sm shadow-lg
        animate-[slideIn_0.3s_ease-out]
        ${getToastStyles()}
      `}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm uppercase tracking-wider">
          {toast.message}
        </span>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Cerrar notificación"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
