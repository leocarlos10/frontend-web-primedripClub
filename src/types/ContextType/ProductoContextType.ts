import type { ProductUpdateData } from "../product";
import type { ErrorResponse } from "../requestType/common/ErrorResponse";
import type { Response } from "../requestType/common/Response";
import type { ProductoRequest } from "../requestType/producto/ProductoRequest";
import type { ProductoResponse } from "../requestType/producto/ProductoResponse";

export type ProductoContextType = {
  guardarProducto: (producto: ProductoRequest,) => Promise<Response<ProductoResponse> | ErrorResponse>;
  obtenerProductos: () => Promise<Response<ProductoResponse[]> | ErrorResponse>;
  actualizarProductos: (producto: ProductUpdateData,) => Promise<Response<ProductoResponse> | ErrorResponse>;
  obtenerProductosActivos: () => Promise<Response<ProductoResponse[]> | ErrorResponse>;
  eliminarProducto: (id:number) => Promise<Response<boolean> | ErrorResponse>;
};
