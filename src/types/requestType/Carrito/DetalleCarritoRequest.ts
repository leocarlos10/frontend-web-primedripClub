export type DetalleCarritoRequest = {
  carritoId?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  usuarioId?: number;
  sessionId?: string;
};
