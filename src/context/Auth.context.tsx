import { createContext, useState, useEffect, type ReactNode } from "react";
import type { AuthContextType } from "../types/ContextType/AuthContextType";
import type { LoginResponse } from "../types/requestType/usuario/LoginResponse";
import { clearCartSessionStorage, clearCartStorage, getSecureItem,  removeSecureItem,  } from "../utils/";
import { user_key_storage } from "../Config";

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {

    const info = getSecureItem<LoginResponse>(user_key_storage);

    if (info) {
      try {
        setUser(info);
        setIsAuthenticated(true);

        // Verificar si el usuario tiene rol de admin
        const hasAdminRole = info.roles?.some(
          (role: string) => role === "ROLE_ADMIN",
        );
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error("Error al procesar datos de usuario:", error);
        logout();
      }
    }
    setLoading(false);
  };

  const logout = () => {
    removeSecureItem(user_key_storage);
    clearCartSessionStorage();
    clearCartStorage();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    location.href = "/";
  };

  const refreshAuth = () => {
    checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
