import { createContext, useState, useEffect, type ReactNode } from "react";
import type { AuthContextType } from "../types/ContextType/AuthContextType";
import type { LoginResponse } from "../types/requestType/LoginResponse";

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
    const info = sessionStorage.getItem("info");

    if (info) {
      try {
        const parsedInfo: LoginResponse = JSON.parse(info);
        setUser(parsedInfo);
        setIsAuthenticated(true);

        // Verificar si el usuario tiene rol de admin
        const hasAdminRole = parsedInfo.roles?.some(
          (role: string) =>
            role === "ROLE_ADMIN",
        );
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
        logout();
      }
    }
    setLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem("info");
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
