import { Link } from "react-router";
import imagen22 from "../../assets/imagen22.jpeg";

export default function Hero() {
  return (
    <header className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-900">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 flex flex-row justify-center pointer-events-none">
        <img src={imagen22} alt="imagen hero" className="object-cover" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-2 leading-[0.9]">
          <span className="text-white block">EL TIEMPO ES</span>
          <span className="text-primary block">TU MAYOR ACTIVO</span>
        </h1>
        <p className="text-zinc-300 text-sm md:text-base max-w-xl mx-auto mb-10 font-light tracking-widest mt-6">
          Curaduría exclusiva de alta relojería y otros productos de colección.
        </p>
        <Link to="/catalogo" 
        className="px-10 py-4 border border-white 
        text-white text-xs font-bold uppercase tracking-[0.3em] 
        hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
          VER CATÁLOGO
        </Link>
      </div>
    </header>
  );
}
