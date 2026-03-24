import { Link, useSearchParams } from "react-router";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useAuth } from "../../hooks/useAuth";
import { useCategoria } from "../../hooks/useCategoria";
import { useCarrito } from "../../hooks/useCarrito";
import { useState, useEffect, useRef } from "react";
import type { CategoriaResponse } from "../../types/requestType/categoria/CategoriaResponse";
import type { Response } from "../../types/requestType/common/Response";
import { BlurFade } from "../ui/blur-fade";

export default function Header() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { obtenerCategorias } = useCategoria();
  const { obtenerCantidadTotal } = useCarrito();
  const [categorias, setCategorias] = useState<CategoriaResponse[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobileCategoriasOpen, setIsMobileCategoriasOpen] =
    useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const cantidadCarrito = obtenerCantidadTotal();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Función helper para construir URLs con filtros combinados
  const buildFilterUrl = (newParam: string, newValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(newParam, newValue);
    return `/catalogo?${params.toString()}`;
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchParams.has("sexo") || searchParams.has("categoriaId");

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prevState) => {
      if (prevState) {
        setIsMobileCategoriasOpen(false);
      }
      return !prevState;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoriasOpen(false);
  };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideMenu = mobileMenuRef.current?.contains(target);
      const clickedOnMenuButton = menuButtonRef.current?.contains(target);

      if (!clickedInsideMenu && !clickedOnMenuButton) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 sm:gap-8">
        {/* Logo */}
        <BlurFade delay={0.15}>
          <div className="shrink-0">
            <Link
              to={"/"}
              onClick={closeMobileMenu}
              className="text-xl font-extrabold tracking-tighter uppercase italic"
            >
              Prime<span className="text-primary">Drip</span>Club
            </Link>
          </div>
        </BlurFade>

        {/* Navigation Links & Search: solo pantallas amplias */}
        <BlurFade delay={0.3}>
          <div className="hidden md:flex flex-1 items-center justify-end gap-5">
            <div className="flex items-center gap-6">
              <Link
                to={"/"}
                className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
              >
                Destacados
              </Link>
              <Link
                to={"/catalogo"}
                className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
              >
                Catálogo
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
                      categorias.map((categoria, idx) => (
                        <BlurFade key={categoria.id} delay={0.35 + idx * 0.05}>
                          <li className="mb-1">
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
                        </BlurFade>
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
        </BlurFade>

        {/* acciones: solo pantallas amplias */}
        <BlurFade delay={0.45}>
          <div className="hidden md:flex items-center gap-5 ">
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
                  {isAuthenticated && (
                    <li className="py-2">
                      <button
                        className="text-[11px] uppercase tracking-widest hover:text-red-500 block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        onClick={logout}
                      >
                        cerrar sesión
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <Link
              to="/carrito"
              className="hover:text-primary transition-colors relative flex items-center"
            >
              <span
                className="material-symbols-outlined text-[22px]"
                title="carrito"
              >
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
              title="cambio de tema"
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
        </BlurFade>

        {/* acciones compactas + menú hamburguesa para mobile y desktop pequeño */}
        <BlurFade delay={0.35}>
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <div className="relative group">
              <button className="hover:text-primary transition-colors flex items-center">
                <span className="material-symbols-outlined text-[22px] cursor-pointer">
                  person
                </span>
              </button>
              {/* menu desplegable para el perfil */}
              <div className="absolute top-full right-0 pt-4 hidden group-hover:block">
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
                  {isAuthenticated && (
                    <li className="py-2">
                      <button
                        className="text-[11px] uppercase tracking-widest hover:text-red-500 block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        onClick={logout}
                      >
                        cerrar sesión
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <Link
              to="/carrito"
              className="hover:text-primary transition-colors relative flex items-center"
              onClick={closeMobileMenu}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                title="carrito"
              >
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
              title="cambio de tema"
            >
              {isDark ? (
                <span className="material-symbols-outlined text-[22px] hidden dark:block">
                  light_mode
                </span>
              ) : (
                <span className="material-symbols-outlined text-[22px] dark:hidden">
                  dark_mode
                </span>
              )}
            </button>

            <button
              ref={menuButtonRef}
              className="hover:text-primary transition-colors flex items-center cursor-pointer"
              onClick={handleMobileMenuToggle}
              aria-label="Abrir menú de navegación"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </BlurFade>
      </div>

      {/* Overlay para bloquear interacción mientras el menú está abierto */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Menú responsive para mobile y desktop pequeño */}
      <div
        id="mobile-navigation-menu"
        ref={mobileMenuRef}
        className={`md:hidden fixed z-50 top-20 left-0 right-0 max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-zinc-200 dark:border-zinc-800 bg-background-light dark:bg-background-dark transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="px-4 sm:px-6 py-6 flex flex-col gap-4">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
          >
            Destacados
          </Link>

          <Link
            to="/catalogo"
            onClick={closeMobileMenu}
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
          >
            Catálogo
          </Link>

          <Link
            to={buildFilterUrl("sexo", "Hombre")}
            onClick={closeMobileMenu}
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
          >
            Hombre
          </Link>

          <Link
            to={buildFilterUrl("sexo", "Mujer")}
            onClick={closeMobileMenu}
            className="text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors"
          >
            Mujer
          </Link>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <button
              className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsMobileCategoriasOpen((prevState) => !prevState)}
            >
              Categorías
              <span className="material-symbols-outlined text-[18px]">
                {isMobileCategoriasOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {isMobileCategoriasOpen && (
              <ul className="mt-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2">
                {categorias.length > 0 ? (
                  categorias.map((categoria) => (
                    <li key={categoria.id}>
                      <Link
                        to={buildFilterUrl("categoriaId", categoria.id.toString())}
                        onClick={closeMobileMenu}
                        className="text-xs font-semibold uppercase tracking-wider hover:text-primary block px-3 py-2 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        {categoria.nombre}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-xs text-zinc-400">
                    No hay categorías disponibles
                  </li>
                )}
              </ul>
            )}
          </div>

          {hasActiveFilters && (
            <Link
              to="/catalogo"
              onClick={closeMobileMenu}
              className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                filter_alt_off
              </span>
              Limpiar filtros
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
