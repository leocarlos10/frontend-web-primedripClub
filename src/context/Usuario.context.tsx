import { createContext, type ReactNode } from "react";

const UsuarioContext = createContext<null>(null);

function UsuarioProvider({ children }: { children: ReactNode }) {

    return (
        <UsuarioContext.Provider value={null}>
            {children}
        </UsuarioContext.Provider>
    )
}

export { UsuarioContext, UsuarioProvider };
