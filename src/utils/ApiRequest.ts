import type { Options } from "../types/requestType/common/Options";
import type { Response } from "../types/requestType/common/Response";
import type { ErrorResponse } from "../types/requestType/common/ErrorResponse";
import { handleApiResponse } from "./handleApiResponse";
/**
 * Realiza una petición HTTP y maneja la respuesta
 * @template T - Tipo de datos de la respuesta esperada
 * @template B - Tipo de datos del body/payload que se envía en la petición
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de fetch (method, body, etc.)
 * @returns {Promise<Response<T> | ErrorResponse>} Respuesta estandarizada
 */
export const ApiRequest = async <T = any, B = any>(
  endpoint: string,
  options: Options<B>,
): Promise<Response<T> | ErrorResponse> => {
  try {
    // el segundo parametro del fetch espera un RequestInit
    const request = await fetch(endpoint, {
      method: options.method,
      headers: options.headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      mode: "cors",
    });

    return await handleApiResponse<T>(request);
  } catch (error) {
    return {
      timestamp: new Date().toISOString(),
      status: 0,
      error: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Error de conexión",
      path: endpoint,
    } as ErrorResponse;
  }
};
