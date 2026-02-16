export type DetalleCarritoResponse = {
  id: number;
  carritoId: number;
  productoId: number;
  productoNombre: string;
  productoImagenUrl: string;
  cantidad: number;
  precioUnitario: number;
  fechaAgregado: string;
};
