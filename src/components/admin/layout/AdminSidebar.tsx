import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const menuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      icon: "dashboard",
      label: "Panel Principal",
    },
    {
      id: "productos",
      path: "/productos",
      icon: "shopping_bag",
      label: "Productos",
    },
    {
      id: "pedidos",
      path: "/pedidos",
      icon: "receipt_long",
      label: "Pedidos",
    },
    {
      id: "ventas",
      path: "/ventas",
      icon: "trending_up",
      label: "Ventas",
    },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 border-r border-slate-200 dark:border-zinc-800 flex flex-col fixed h-full bg-white dark:bg-background-dark z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-8 flex items-center gap-3">
          <span className="text-xl font-extrabold tracking-tighter uppercase italic">
            Prime<span className="text-primary">Drip</span>Club
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors w-full text-left ${
                  isActive
                    ? "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border-l-2 border-slate-900 dark:border-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleUserMenu}
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center relative hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer">
                person
              </span>

              {/* Menu desplegable para el usuario admin */}
              {isUserMenuOpen && (
                <>
                  {/* Overlay para cerrar al hacer click fuera */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />

                  <div className="absolute bottom-full left-0 mb-2 z-50">
                    <div className="bg-white dark:bg-zinc-900 border rounded-lg border-zinc-200 dark:border-zinc-800 w-48 shadow-2xl overflow-hidden">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 
                          hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">
                            logout
                          </span>
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </button>
            <div>
              <p className="text-xs font-semibold dark:text-white wrap-break-word line-clamp-2 ">
                {isAuthenticated && isAdmin && user && user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
