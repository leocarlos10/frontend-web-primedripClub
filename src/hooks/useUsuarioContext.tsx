import { UsuarioContext } from "@/context/Usuario.context";
import { useContext } from "react";

export const useUsuarioContext = () => {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("useUsuarioContext must be used within a UsuarioProvider");
    }
    return context;
}