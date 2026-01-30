interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
}

const LoadingSpinner = ({ fullScreen = false, text = "Cargando..." }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-700 border-t-primary rounded-full animate-spin"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
