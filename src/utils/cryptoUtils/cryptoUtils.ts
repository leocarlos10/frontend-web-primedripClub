import CryptoJS from "crypto-js";
import { secret_key } from "../../Config";

/**
 * Cifra un objeto/string usando AES-256
 * @param data - El objeto o string a cifrar
 * @return El string cifrado
 */
export const encryptData = (data: any): string => {
  try {
    const jsonString = typeof data === "string" ? data : JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, secret_key).toString();
    return encrypted;
  } catch (error) {
    console.error("❌ Error al cifrar datos:", error);
    throw error;
  }
};

/**
 * Descifra un string y lo convierte de vuelta al objeto original
 * @param encryptedData - El string cifrado a descifrar
 * @template T - El tipo del objeto esperado después de descifrar
 * @return El objeto descifrado o null si ocurre un error
 */
export const decryptData = <T = any>(encryptedData: string): T | null => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, secret_key);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!jsonString) {
      console.error(
        "❌ Error: No se pudo descifrar los datos (clave incorrecta o datos corruptos)",
      );
      return null;
    }

    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("❌ Error al descifrar datos:", error);
    return null;
  }
};
