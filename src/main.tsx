import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DarkModeProvider } from "./context/useDarkMode.context.tsx";
import { BrowserRouter } from "react-router";
import { UsuarioProvider } from "./context/Usuario.context.tsx";
import { ToastProvider } from "./context/Toast.context.tsx";
import { AuthProvider } from "./context/Auth.context.tsx";
import { ProductoProvider } from "./context/Producto.Context.tsx";
import { CategoriaProvider } from "./context/CategoriaContext.tsx";
import { CarritoProvider } from "./context/Carrito.Context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CarritoProvider>
            <DarkModeProvider>
              <UsuarioProvider>
                <ProductoProvider>
                  <CategoriaProvider>
                    <App />
                  </CategoriaProvider>
                </ProductoProvider>
              </UsuarioProvider>
            </DarkModeProvider>
          </CarritoProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
