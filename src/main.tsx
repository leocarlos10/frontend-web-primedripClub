import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DarkModeProvider } from "./context/useDarkMode.context.tsx";
import { BrowserRouter } from "react-router";
import { UsuarioProvider } from "./context/Usuario.context.tsx";
import { ToastProvider } from "./context/Toast.context.tsx";
import { AuthProvider } from "./context/Auth.context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <DarkModeProvider>
          <UsuarioProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </UsuarioProvider>
        </DarkModeProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
