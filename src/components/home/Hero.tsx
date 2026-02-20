import { Link } from "react-router";
import imagen22 from "../../assets/imagen22.jpeg";
import { useDarkMode } from "../../hooks/useDarkMode";

function Hero({img}: {img?: string}) {
    const {isDark} = useDarkMode();
  return (
    <div className="relative flex items-center justify-center h-[72dvh] w-full p-4">
      {/* Imagen de fondo */}
      <img
        src={img || imagen22}
        alt="imagen hero"
        className="absolute w-[50dvh] object-contain z-0"
      />
      {/* Overlay opcional para oscurecer la imagen */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      {/* Contenido encima */}
      <div className="relative z-20 text-center w-full">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase mb-2 leading-[0.9]">
          <span className="text-white block">EL TIEMPO ES</span>
          <span className="text-primary block">TU MAYOR ACTIVO</span>
        </h1>
        <p className="text-zinc-300 text-xs md:text-base max-w-xl mx-auto mb-6 font-light tracking-widest mt-2">
          Curaduría exclusiva de alta relojería y otros productos de colección.
        </p>
        <Link
          to="/catalogo"
          className="px-6 py-2 border border-white text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
        >
          VER CATÁLOGO
        </Link>
      </div>
    </div>
  );
}

export default Hero