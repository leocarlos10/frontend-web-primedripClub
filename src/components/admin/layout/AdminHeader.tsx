import { useDarkMode } from "../../../hooks/useDarkMode";

interface AdminHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-zinc-800 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden flex justify-center items-center p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-slate-900 dark:text-white">
            menu
          </span>
        </button>
        <h1 className="text-xs md:text-sm font-medium uppercase tracking-widest dark:text-white">
          Prime Drip / {title}
        </h1>
      </div>

      <button
        onClick={toggleDarkMode}
        className="flex justify-center items-center p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-slate-900 dark:text-white">
          {isDark ? "light_mode" : "dark_mode"}
        </span>
      </button>
    </header>
  );
}
