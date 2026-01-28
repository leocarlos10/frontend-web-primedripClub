import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DarkModeProvider } from './context/useDarkMode.context.tsx'
import { BrowserRouter } from 'react-router'
import { UsuarioProvider } from './context/Usuario.context.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <UsuarioProvider>
          <App />
        </UsuarioProvider>
      </DarkModeProvider>
    </BrowserRouter>
  </StrictMode>,
);
