import { createContext, useState, useEffect, type ReactNode } from "react";
import type { AuthContextType } from "../types/ContextType/AuthContextType";
import type { LoginResponse } from "../types/requestType/usuario/LoginResponse";
import { getSecureSessionItem, removeSecureSessionItem } from "../utils/";
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
    // getSecureSessionItem ya descifra y parsea el JSON, devuelve el objeto directamente
    const info = getSecureSessionItem<LoginResponse>(user_key_storage);

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
    removeSecureSessionItem(user_key_storage);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
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
