import { useContext } from "react";
import { DarkModeContext } from "../context/useDarkMode.context";
/* 
 Este Hook permite gestionar el modo oscuro en la aplicación.
 hay que tener en cuenta que como el contexto puede ser undefined
 toca asegurase de el context existe y no retorna undefind con un condicional
*/
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error(
      "useDarkModeContext debe usarse dentro de DarkModeProvider",
    );
  }
  return context;
}
