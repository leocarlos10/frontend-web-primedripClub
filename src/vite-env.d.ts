/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_BACKEND: string;
  readonly VITE_URL_BACKEND_IMAGE: string;
  readonly VITE_CART_STORAGE_KEY: string;
  readonly VITE_ENCRYPTION_KEY: string;
  readonly VITE_USER_KEY_STORAGE: string;
  readonly VITE_SESSION_KEY_STORAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
