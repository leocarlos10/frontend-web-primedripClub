import Slider from "react-slick";
import { useRef } from "react";
import { useProductosActivos } from "../../hooks/useProductosActivos";
import { Link } from "react-router";
import { BlurFade } from "../ui/blur-fade";
import { url_backend_image } from "@/Config";

export default function SliderImg() {
  const sliderRef = useRef<any>(null);
  const { productos, isLoading } = useProductosActivos();

  // Obtener los últimos 5 productos (ordenar por fecha de creación descendente)
  const productosSlider = productos
    .sort(
      (a, b) =>
        new Date(b.fechaCreacion).getTime() -
        new Date(a.fechaCreacion).getTime()
    )
    .slice(0, 5);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    afterChange: (index: number) => {
      const slides = document.querySelectorAll(".slick-slide");
      slides.forEach((slide, i) => {
        if (i === index) {
          const focusable = slide.querySelector(
            'input, button, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable) (focusable as HTMLElement).focus();
        }
      });
    },
  };

  if (isLoading) {
    return (
      <header className="flex flex-col justify-center h-[75dvh] slider-container bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <header className="flex flex-col justify-center h-[75dvh] slider-container">
      <Slider ref={sliderRef} {...settings} className="absolute inset-0 z-0">
        {productosSlider.map((producto) => (
          <div key={producto.id}>
            <BlurFade delay={0.25}>
              <div className="relative flex items-center justify-center h-[75dvh] w-full p-4">
                {/* overlay */}
                <div className="absolute inset-0 h-[75dvh] bg-black/40 z-10"></div>

                {/* Imagen de fondo */}
                <img
                  src={`${url_backend_image}${producto.imagenUrl}`} // Asegúrate de que producto.imagen contenga la ruta correcta
                  alt={producto.nombre}
                  className="absolute  h-[75dvh] object-cover z-0"
                />

                {/* Contenido encima */}
                <div className="relative z-20 text-center w-full max-w-2xl">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-primary/80 text-white text-xs font-bold uppercase tracking-widest">
                      {producto.etiqueta || "Nuevo"}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-[0.9] text-white drop-shadow-lg">
                    {producto.nombre}
                  </h1>
                  <p className="text-white text-sm md:text-base max-w-xl mx-auto mb-6 font-light tracking-widest drop-shadow-md line-clamp-2">
                    {producto.descripcion}
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-2xl md:text-3xl font-bold text-primary drop-shadow-lg">
                      ${producto.precio.toLocaleString("es-CO")}
                    </span>
                    <span className="text-white text-sm">
                      Stock: {producto.stock}
                    </span>
                  </div>
                  <Link
                    to={`/producto/${producto.id}`}
                    className="px-8 py-3 border-2 border-white text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer inline-block drop-shadow-lg"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </BlurFade>
          </div>
        ))}
      </Slider>
    </header>
  );
}
