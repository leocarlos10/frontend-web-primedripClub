import type { CategoriaResponse } from "../requestType/categoria/CategoriaResponse";
import type { ErrorResponse } from "../requestType/common/ErrorResponse";
import type { Response } from "../requestType/common/Response";

export interface CategoriaContextType {
  obtenerCategorias: () => Promise<
    Response<CategoriaResponse[]> | ErrorResponse
  >;
}
