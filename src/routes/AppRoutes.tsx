import { Route, Routes } from "react-router";
import Homepage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Private/Dashboard";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import  ProtectedRoute from "../components/auth/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* solo los usuarios con rol admin 
      pueden aceder al dashboard del sistema 
      */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
          <Dashboard />
        </ProtectedRoute>
        } />
    </Routes>
  );
};
