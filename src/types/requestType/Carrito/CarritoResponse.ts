import type { DetalleCarritoResponse } from "./DetalleCarritoResponse";

export type CarritoResponse = {
    id: number;
    usuarioId: number;
    sessionId: string;
    items: DetalleCarritoResponse[];
    carritoId: number;
    fechaCreacion: string;
    fechaActualizacion: string;
}