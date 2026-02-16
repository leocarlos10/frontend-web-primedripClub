export type ActualizarDetalleCarrito = {
  productoId: number;
  carritoId?: number;
  cantidad: number;
  usuarioId?: number;
  sessionId?: string;
};
