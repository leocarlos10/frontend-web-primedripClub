import { createContext, useEffect, useState} from "react";
import type { ReactNode } from "react";
import type { DarkModeContextType } from "../types/DarkModeContextType";

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

 function DarkModeProvider({ children }: { children: ReactNode }) {
  
    const [isDark, setIsDark] = useState(() => {
    
      if (typeof window === "undefined") return false;
    return (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeContext, DarkModeProvider };