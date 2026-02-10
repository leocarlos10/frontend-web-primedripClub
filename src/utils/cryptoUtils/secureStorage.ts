import { encryptData, decryptData } from "./cryptoUtils";

/**
 * Guarda datos cifrados en localStorage
 */
export const setSecureItem = (key: string, value: any): void => {
  try {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`❌ Error al guardar ${key} en localStorage:`, error);
  }
};

/**
 * Lee y descifra datos de localStorage
 */
export const getSecureItem = <T = any>(key: string): T | null => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    return decryptData<T>(encrypted);
  } catch (error) {
    console.error(`❌ Error al leer ${key} de localStorage:`, error);
    return null;
  }
};

/**
 * Elimina item de localStorage
 */
export const removeSecureItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`❌ Error al eliminar ${key} de localStorage:`, error);
  }
};

/**
 * Guarda datos cifrados en sessionStorage
 */
export const setSecureSessionItem = (key: string, value: any): void => {
  try {
    const encrypted = encryptData(value);
    sessionStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`❌ Error al guardar ${key} en sessionStorage:`, error);
  }
};

/**
 * Lee y descifra datos de sessionStorage
 */
export const getSecureSessionItem = <T = any>(key: string): T | null => {
  try {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;

    return decryptData<T>(encrypted);
  } catch (error) {
    console.error(`❌ Error al leer ${key} de sessionStorage:`, error);
    return null;
  }
};

/**
 * Elimina item de sessionStorage
 */
export const removeSecureSessionItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`❌ Error al eliminar ${key} de sessionStorage:`, error);
  }
};
