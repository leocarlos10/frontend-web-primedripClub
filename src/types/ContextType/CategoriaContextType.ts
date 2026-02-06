import type { CategoriaResponse } from "../requestType/categoria/CategoriaResponse";
import type { CategoriaRequest } from "../requestType/categoria/CategoriaRequest";
import type { ErrorResponse } from "../requestType/common/ErrorResponse";
import type { Response } from "../requestType/common/Response";

export interface CategoriaContextType {
  obtenerCategorias: () => Promise<
    Response<CategoriaResponse[]> | ErrorResponse
  >;
  obtenerCategoriaPorId: (
    id: number,
  ) => Promise<Response<CategoriaResponse> | ErrorResponse>;
  crearCategoria: (
    categoria: CategoriaRequest,
  ) => Promise<Response<CategoriaResponse> | ErrorResponse>;
  actualizarCategoria: (
    id: number,
    categoria: CategoriaRequest,
  ) => Promise<Response<CategoriaResponse> | ErrorResponse>;
  eliminarCategoria: (id: number) => Promise<Response<boolean> | ErrorResponse>;
}
