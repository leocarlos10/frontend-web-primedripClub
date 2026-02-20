import { url_backend } from "../../Config";
import type { ActualizarDetalleCarrito } from "../../types/requestType/Carrito/ActualizarDetalleCarrito";
import type { CarritoResponse } from "../../types/requestType/Carrito/CarritoResponse";
import type { CartSession } from "../../types/requestType/Carrito/cartSession";
import type { DetalleCarritoRequest } from "../../types/requestType/Carrito/DetalleCarritoRequest";
import type { DetalleCarritoResponse } from "../../types/requestType/Carrito/DetalleCarritoResponse";
import type { EliminarDetalleCarrito } from "../../types/requestType/Carrito/EliminarDetalleCarrito";
import type { ErrorResponse } from "../../types/requestType/common/ErrorResponse";
import type { Response } from "../../types/requestType/common/Response";
import { getHeaders } from "../Headers";
import { ApiRequest } from "../requestUtils";

export const carritoService = {
  /**
   * Este metodo se ejecuta la primera vez que el usuario
   * guarda un producto en el carrito, se encarga de crear un nuevo carrito.
   * para las peticiones se usa la utilidad de ApiRequest,
   * se le pasa la url del backend, el metodo POST,
   * los headers y el body con la informacion del carrito a crear
   * @param CartSession - Objeto que contiene la información necesaria para crear un nuevo carrito
   * @returns Response<CarritoResponse> - Si la creación del carrito fue exitosa, devuelve un objeto con la información del carrito creado
   * @returns ErrorResponse - Si hubo un error al crear el carrito, devuelve un objeto con el mensaje de error
   * */
  inicializarCarrito: async (
    cartSession: CartSession,
  ): Promise<Response<CarritoResponse> | ErrorResponse> => {
    try {
      const endpoint = `${url_backend}/carrito`;
      console.log("🔵 Inicializando carrito - Endpoint:", endpoint);
      console.log("🔵 Payload:", cartSession);

      const response = await ApiRequest<CarritoResponse, CartSession>(
        endpoint,
        {
          method: "POST",
          headers: getHeaders(),
          body: cartSession,
        },
      );

      console.log("🔵 Respuesta completa de inicializarCarrito:", response);

      if (response.success) {
        return response as Response<CarritoResponse>;
      } else {
        return response as ErrorResponse;
      }
    } catch (error) {
      console.error("❌ Error al inicializar el carrito:", error);
      return {
        success: false,
        message: "Error al inicializar el carrito",
      } as ErrorResponse;
    }
  },

  /**
   * Este metodo se ejecuta cada vez que el usuario guarda un producto en el carrito,
   * se encarga de guardar el producto en el carrito existente.
   * @param DetalleCarritoRequest - Objeto que contiene la información necesaria para guardar un producto en el carrito
   * @returns Response<DetalleCarritoResponse> - Si la operación fue exitosa, devuelve un objeto con la información del detalle del carrito actualizado
   * @returns ErrorResponse - Si hubo un error al guardar el producto en el carrito, devuelve un objeto con el mensaje de error
   * */
  guardarProductoEnCarrito: async (
    DetalleCarritoRequest: DetalleCarritoRequest,
  ): Promise<Response<DetalleCarritoResponse> | ErrorResponse> => {
    try {
      const endpoint = `${url_backend}/detalle-carrito`;
      console.log("🟢 Guardando producto en carrito - Endpoint:", endpoint);
      console.log("🟢 Payload:", DetalleCarritoRequest);

      const response = await ApiRequest<
        DetalleCarritoResponse,
        DetalleCarritoRequest
      >(endpoint, {
        method: "POST",
        headers: getHeaders(),
        body: DetalleCarritoRequest,
      });

      console.log("🟢 Respuesta completa de guardarProducto:", response);

      if (response.success) {
        return response as Response<DetalleCarritoResponse>;
      } else {
        return response as ErrorResponse;
      }
    } catch (error) {
      console.error("❌ Error al guardar el producto en el carrito:", error);
      return {
        success: false,
        message: "Error al guardar el producto en el carrito",
      } as ErrorResponse;
    }
  },

  /**
   * Este metodo se ejecuta cada vez que el usuario accede al carrito, se encarga de obtener la información del carrito existente.
   * @param CarritoRequest - Objeto que contiene la información necesaria para obtener el carrito
   * @returns Response<CarritoResponse> - Si la operación fue exitosa, devuelve un objeto con la información del carrito existente
   * @returns ErrorResponse - Si hubo un error al obtener el carrito, devuelve un objeto con el mensaje de error
   */
  obtenerCarrito: async (
    cartSession: CartSession,
  ): Promise<Response<CarritoResponse> | ErrorResponse> => {
    try {
      // antes de hacer la peticion creamos los parametros de la url con la informacion del carrito
      const params = new URLSearchParams();
      if (cartSession.carritoId) params.append("carritoId", String(cartSession.carritoId));
      if (cartSession.usuarioId) params.append("usuarioId", String(cartSession.usuarioId));
      if (cartSession.sessionId) params.append("sessionId", cartSession.sessionId);

      const response = await ApiRequest<CarritoResponse, CartSession>(
        `${url_backend}/carrito?${params.toString()}`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      if (response.success) {
        return response as Response<CarritoResponse>;
      } else {
        return response as ErrorResponse;
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return {
        success: false,
        message: "Error al obtener el carrito",
      } as ErrorResponse;
    }
  },

  /**
   * este metodo se encarga de actualizar la cantidad
   * del prooducto en el carrito
   * @param actualizarDetalleCarrito - Objeto que contiene la información necesaria para actualizar la cantidad del producto en el carrito
   * @returns Response<Boolean> - Si la operación fue exitosa, devuelve un objeto con un booleano indicando que la cantidad se actualizó correctamente
   * @returns ErrorResponse - Si hubo un error al actualizar la cantidad del producto en el carrito, devuelve un objeto con el mensaje de error
   */
  actualizarCantidad: async (
    actualizarDetalleCarrito: ActualizarDetalleCarrito,
  ): Promise<Response<Boolean> | ErrorResponse> => {
    try {
      const response = await ApiRequest<Boolean, ActualizarDetalleCarrito>(
        `${url_backend}/detalle-carrito`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: actualizarDetalleCarrito,
        },
      );

      if (response.success) {
        return response as Response<Boolean>;
      } else {
        return response as ErrorResponse;
      }
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito:",
        error,
      );
      return {
        success: false,
        message: "Error al actualizar la cantidad del producto en el carrito",
      } as ErrorResponse;
    }
  },

  /**
   * Este metodo se encarga de eliminar un detalle del carrito
   * @param eliminarDetalleCarrito - Objeto que contiene la información necesaria para eliminar un detalle del carrito
   * @returns Response<Boolean> - Si la operación fue exitosa, devuelve un objeto con un booleano indicando que el detalle se eliminó correctamente
   * @returns ErrorResponse - Si hubo un error al eliminar el detalle del carrito, devuelve un objeto con el mensaje de error
   */
  eliminarDetalleCarrito: async (
    eliminarDetalleCarrito: EliminarDetalleCarrito,
  ): Promise<Response<Boolean> | ErrorResponse> => {
    try {
      const response = await ApiRequest<Boolean, EliminarDetalleCarrito>(
        `${url_backend}/detalle-carrito`,
        {
          method: "DELETE",
          headers: getHeaders(),
          body: eliminarDetalleCarrito,
        },
      );

      if (response.success) {
        return response as Response<Boolean>;
      } else {
        return response as ErrorResponse;
      }
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
      return {
        success: false,
        message: "Error al eliminar el producto del carrito",
      } as ErrorResponse;
    }
  },
};
