import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";
import type { ProtectedRouteProps } from "../../types/ProtectedRouteprops";


/**
 * Componente que protege rutas privadas
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si está autorizado
 * @param {Array<string>} props.allowedRoles - Roles permitidos para acceder (opcional)
 */
const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return <LoadingSpinner fullScreen text="Verificando acceso..." />;
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se especificaron roles permitidos, verificar
  if (allowedRoles.length > 0) {
    const hasPermission = user?.roles?.some((role) =>
      allowedRoles.includes(role)
    );

    // Si no tiene el rol requerido, redirige a página no autorizada
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Si todo está bien, renderiza el componente hijo
  return <>{children}</>;
};

export default ProtectedRoute;
