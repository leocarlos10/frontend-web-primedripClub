import { Link, useSearchParams } from "react-router";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../hooks/useAuth";
import { useCategoria } from "../../hooks/useCategoria";
import { useCarrito } from "../../hooks/useCarrito";
import { useState, useEffect } from "react";
import type { CategoriaResponse } from "../../types/requestType/categoria/CategoriaResponse";
import type { Response } from "../../types/requestType/common/Response";

export default function Header() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { obtenerCategorias } = useCategoria();
  const { obtenerCantidadTotal } = useCarrito();
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [searchParams] = useSearchParams();
  const cantidadCarrito = obtenerCantidadTotal();

  // Función helper para construir URLs con filtros combinados
  const buildFilterUrl = (newParam: string, newValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(newParam, newValue);
    return `/catalogo?${params.toString()}`;
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchParams.has("sexo") || searchParams.has("categoriaId");

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const respuesta = await obtenerCategorias();
        if (respuesta.success) {
          setCategorias((respuesta as Response<CategoriaResponse[]>).data);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    cargarCategorias();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-12">
        {/* Logo */}
        <div className="shrink-0">
          <Link
            to={"/"}
            className="text-xl font-extrabold tracking-tighter uppercase italic"
          >
            Prime<span className="text-primary">Drip</span>Club
          </Link>
        </div>

        {/* Navigation Links & Search */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="flex items-center gap-6">
            <Link
              to={"/"}
              className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              Destacados
            </Link>
            <Link
              to={buildFilterUrl("sexo", "Hombre")}
              className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              Hombre
            </Link>
            <Link
              to={buildFilterUrl("sexo", "Mujer")}
              className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
            >
              Mujer
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                Categorías
              </button>
              {/* menu desplegable para categorias */}
              <div className="absolute top-full left-0 pt-4 hidden group-hover:block z-50">
                <ul className="bg-white dark:bg-zinc-900 border-2 rounded-lg border-zinc-200 dark:border-zinc-700 p-3 w-56 shadow-xl">
                  {categorias.length > 0 ? (
                    categorias.map((categoria) => (
                      <li key={categoria.id} className="mb-1">
                        <Link
                          to={buildFilterUrl(
                            "categoriaId",
                            categoria.id.toString(),
                          )}
                          className="text-xs font-semibold uppercase tracking-wider hover:text-primary block px-4 py-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                        >
                          {categoria.nombre}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-xs text-zinc-400">
                      No hay categorías disponibles
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Botón Limpiar Filtros */}
            {hasActiveFilters && (
              <Link
                to="/catalogo"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  filter_alt_off
                </span>
                Limpiar filtros
              </Link>
            )}
          </div>
          {/* Search Bar */}
          <div className="relative w-full max-w-50">
            {/* Por el momento esta funcionalidad no se va a implmentar. */}
            {/* <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-base">
              search
            </span> */}
            {/*  <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-1 focus:ring-primary pl-9 pr-4 py-1.5 text-xs placeholder:text-zinc-500"
            /> */}
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
                  {isAuthenticated && !isAdmin ? (
                    <span className="text-[11px] wrap-break-word line-clamp-2">
                      {user?.email}
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
                  <button
                    className="text-[11px] uppercase tracking-widest hover:text-red-500 block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    onClick={logout}
                  >
                    cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <Link
            to="/carrito"
            className="hover:text-primary transition-colors relative flex items-center"
          >
            <span className="material-symbols-outlined text-[22px]">
              shopping_bag
            </span>
            {cantidadCarrito > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cantidadCarrito}
              </span>
            )}
          </Link>
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
