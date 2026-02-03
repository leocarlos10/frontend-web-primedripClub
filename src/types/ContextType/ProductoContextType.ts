import type { ErrorResponse } from "../requestType/common/ErrorResponse";
import type { Response } from "../requestType/common/Response";
import type { ProductoRequest } from "../requestType/producto/ProductoRequest";
import type { ProductoResponse } from "../requestType/producto/ProductoResponse";

export type ProductoContextType = {
  guardarProducto: (
    producto: ProductoRequest,
  ) => Promise<Response<ProductoResponse> | ErrorResponse>;
  obtenerProductos: () => Promise<Response<ProductoResponse[]> | ErrorResponse>;
};
