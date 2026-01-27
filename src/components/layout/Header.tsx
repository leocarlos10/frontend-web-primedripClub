import { Link } from "react-router";
import { useDarkMode } from "../../hooks/useDarkMode";

export default function Header() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const sesion = false;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-12">
        {/* Logo */}
        <div className="shrink-0">
          <a
            href="#"
            className="text-xl font-extrabold tracking-tighter uppercase italic"
          >
            Prime<span className="text-primary">Drip</span>Club
          </a>
        </div>

        {/* Navigation Links & Search */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              Nuevos
            </a>
            <a
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              Hombre
            </a>
            <a
              href="#"
              className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              Mujer
            </a>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                Categorías
                <span className="material-symbols-outlined text-[14px]">
                  expand_more
                </span>
              </button>
              {/* menu desplegable para categorias */}
              <div className="absolute top-full left-0 pt-4 hidden group-hover:block">
                <ul className="bg-white dark:bg-zinc-900 border rounded-[10px] border-zinc-200 dark:border-zinc-800 p-4 w-48 shadow-2xl">
                  <li className="py-2">
                    <Link
                      to={""}
                      className="text-[10px] uppercase tracking-widest hover:text-primary block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Relojes
                    </Link>
                  </li>
                  <li className="py-2">
                    <Link
                      to={""}
                      className="text-[10px] uppercase tracking-widest hover:text-primary block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      Tenis
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Search Bar */}
          <div className="relative w-full max-w-50">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-1 focus:ring-primary pl-9 pr-4 py-1.5 text-xs placeholder:text-zinc-500"
            />
          </div>
        </div>

        {/* acciones */}
        <div className="flex items-center gap-5 ">
          <div className=" relative group">
            <button className="hover:text-primary transition-colors flex items-center">
              <span className="material-symbols-outlined text-[22px] cursor-pointer">
                person
              </span>
            </button>
            {/* menu desplegable para el perfil */}
            <div className="absolute top-full left-0 pt-4 hidden group-hover:block">
              <ul className="bg-white dark:bg-zinc-900 border rounded-[10px] border-zinc-200 dark:border-zinc-800 p-2.5 min-w-40 max-w-42 shadow-2xl">
                <li className="px-2 py-1 border-b border-zinc-200 dark:border-zinc-800 mb-2">
                  {sesion ? (
                    <span className="text-[11px] wrap-break-word line-clamp-2">
                      leocarlosospinacausil10@gmail.com
                    </span>
                  ) : (
                    <span className="flex flex-col gap-1 text-[11px]">
                      <Link to="/login">iniciar sesión</Link>
                      <Link to="/register">registrarse</Link>
                    </span>
                  )}
                </li>
                <li className="py-2">
                  <Link
                    to={""}
                    className="text-[11px] uppercase tracking-widest hover:text-primary block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    mis pedidos
                  </Link>
                </li>
                <li className="py-2">
                  <Link
                    to={""}
                    className="text-[11px] uppercase tracking-widest hover:text-primary block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    mi perfil
                  </Link>
                </li>
                <li className="py-2">
                  <button className="text-[11px] uppercase tracking-widest hover:text-red-500 block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                    cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <button className="hover:text-primary transition-colors relative flex items-center">
            <span className="material-symbols-outlined text-[22px]">
              shopping_bag
            </span>
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              2
            </span>
          </button>
          <button
            className="hover:text-primary transition-colors flex items-center cursor-pointer"
            onClick={toggleDarkMode}
          >
            {isDark ? (
              <span className="material-symbols-outlined text-[22px] hidden dark:block ">
                light_mode
              </span>
            ) : (
              <span className="material-symbols-outlined text-[22px] dark:hidden ">
                dark_mode
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
