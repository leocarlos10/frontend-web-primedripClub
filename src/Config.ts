const url_backend = import.meta.env.VITE_URL_BACKEND;
if(!url_backend){
  throw new Error("VITE_URL_BACKEND no esta definida en las variables de entorno");
}
export default url_backend;
