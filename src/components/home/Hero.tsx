import { Link } from "react-router";
import imagen22 from "../../assets/imagen22.jpeg";
import { BlurFade } from "../ui/blur-fade";


function Hero({img, description}: {img?: string, description?: boolean}) {

  if(description) {
    return (
      <BlurFade delay={0.25}>
      <div className="relative flex items-center justify-center h-[75dvh] w-full p-4">
        {/* overlay */}
        <div className="absolute inset-0 h-[75dvh] bg-[--color-background-light] dark:bg-[--color-background-dark] z-10"></div>
        {/* Contenido encima */}
        <div className="relative z-20 text-center w-full">
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase mb-2 leading-[0.9]">
            <span className="text-black dark:text-white block">
              EL TIEMPO ES
            </span>
            <span className="text-primary block">TU MAYOR ACTIVO</span>
          </h1>
          <p className="text-zinc-700 dark:text-zinc-300 text-xs md:text-base max-w-xl mx-auto mb-6 font-light tracking-widest mt-2">
            Curaduría exclusiva de alta relojería y otros productos de
            colección.
          </p>
          <Link
            to="/catalogo"
            className="px-6 py-2 border border-black dark:border-white text-black dark:text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
          >
            VER CATÁLOGO
          </Link>
        </div>
      </div>
      </BlurFade>
    );
  }

  return (
    <div className="relative flex items-center justify-center h-[75dvh] w-full p-4">
        <img
          src={img || imagen22}
          alt="imagen hero"
          className="absolute w-[50dvh] object-contain z-0"
        />
    </div>
  );
}

export default Hero