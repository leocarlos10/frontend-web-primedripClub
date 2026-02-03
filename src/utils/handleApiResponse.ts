import type { Response } from "../types/requestType/common/Response";
import type { ErrorResponse } from "../types/requestType/common/ErrorResponse";

/**
 * Maneja respuestas de API de forma estandarizada
 * @param {Response} request - Objeto Response de fetch
 * @returns {Promise<Object>} Objeto con success, data/error y message
 */
export const handleApiResponse = async <T = any>(
  request: globalThis.Response,
): Promise<Response<T> | ErrorResponse> => {
  try {
    const response = (await request.json()) as Response<T> | ErrorResponse;

    if (!request.ok) {
      return response as ErrorResponse;
    }

    return response as Response<T>;
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      status: 0,
      error: "NETWORK_ERROR",
      message:
        error instanceof Error
          ? error.message
          : "Error de conexión con el servidor",
      path: request.url,
    } as ErrorResponse;
  }
};
