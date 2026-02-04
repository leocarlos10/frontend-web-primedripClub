import { Route, Routes } from "react-router";
import Homepage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import Dashboard from "../pages/Private/Dashboard";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ProductosPage from "../pages/Private/ProductosPage";
import PedidosPage from "../pages/Private/PedidosPage";
import VentasPage from "../pages/Private/VentasPage";
import CatalogPage from "../pages/public/CatalogPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/catalogo" element={<CatalogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* solo los usuarios con rol admin 
      pueden aceder al dashboard del sistema 
      */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/productos"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <ProductosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pedidos"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <PedidosPage/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ventas"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <VentasPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
