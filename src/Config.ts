const url_backend = import.meta.env.VITE_URL_BACKEND;
if(!url_backend){
  throw new Error("VITE_URL_BACKEND no esta definida en las variables de entorno");
}

const url_backend_image = import.meta.env.VITE_URL_BACKEND_IMAGE;
if(!url_backend_image){
  throw new Error("VITE_URL_BACKEND_IMAGE no esta definida en las variables de entorno");
}

const cart_storage_key = import.meta.env.VITE_CART_STORAGE_KEY ;

if(!cart_storage_key) {
  throw new Error("VITE_CART_STORAGE_KEY no esta definida en las variables de entorno");
}

const secret_key = import.meta.env.VITE_ENCRYPTION_KEY ;
if(!secret_key) {
  throw new Error("VITE_ENCRYPTION_KEY no esta definida en las variables de entorno");
}

const user_key_storage = import.meta.env.VITE_USER_KEY_STORAGE ;
if(!user_key_storage) {
  throw new Error("VITE_USER_KEY_STORAGE no esta definida en las variables de entorno");
}

const session_key_storage = import.meta.env.VITE_SESSION_KEY_STORAGE ;
if(!session_key_storage) {
  throw new Error("VITE_SESSION_KEY_STORAGE no esta definida en las variables de entorno");
}


export {
  url_backend,
  url_backend_image,
  cart_storage_key,
  secret_key,
  user_key_storage,
  session_key_storage,
};  
