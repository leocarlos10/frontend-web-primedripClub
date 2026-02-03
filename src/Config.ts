const url_backend = import.meta.env.VITE_URL_BACKEND;
if(!url_backend){
  throw new Error("VITE_URL_BACKEND no esta definida en las variables de entorno");
}

const url_backend_image = import.meta.env.VITE_URL_BACKEND_IMAGE;
if(!url_backend_image){
  throw new Error("VITE_URL_BACKEND_IMAGE no esta definida en las variables de entorno");
}
export {url_backend, url_backend_image};
