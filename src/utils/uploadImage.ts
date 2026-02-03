import {url_backend} from "../Config";
import type { LoginResponse } from "../types/requestType/usuario/LoginResponse";
import type { Response } from "../types/requestType/common/Response";

/**
 * Envia la imagen al backend para ser guardada
 * @param file archivo de imagen a subir
 * @returns una promise de tipo Response<string> con la URL de la imagen subida
 * {
 *   "responseCode": 200,
 *   "success": true,
 *   "message": "Imagen subida exitosamente",
 *   "data": {
 *     "imageUrl": "/uploads/images/1234567890-abc.jpg"
 *   }
 * }
 */
export const saveImage = async (
  file: File,
  isAuthenticated: boolean,
  user: LoginResponse,
): Promise<string | undefined> => {
  
  const formData = new FormData();
  formData.append("image", file);
  let token;
  if (isAuthenticated && user) {
    token = user.token;

    try {
      const request = await fetch(`${url_backend}/upload/product-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!request.ok) {
        throw new Error("Error al subir la imagen");
      }

      const response = (await request.json()) as Response<string>;
      console.log("Respuesta de la subida de imagen:", response.message);
      return response.data;
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      return undefined;
    }
  } else {
    console.log("Usuario no autenticado. No se puede subir la imagen.");
    return undefined;
  }
};
