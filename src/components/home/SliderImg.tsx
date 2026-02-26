import Slider from "react-slick";
import { useRef } from "react";
import Hero from "./Hero";
import imagen9 from "../../assets/imagen9.jpeg";
import imagen15 from "../../assets/imagen15.jpeg";
import imagen20 from "../../assets/imagen20.jpeg";
import imagen19 from "../../assets/imagen19.jpeg";

export default function SliderImg() {
  const sliderRef = useRef<any>(null);

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
      // Mueve el foco al slide visible si hay algún elemento interactivo
      const slides = document.querySelectorAll(".slick-slide");
      slides.forEach((slide, i) => {
        if (i === index) {
          // Busca un input, botón o elemento con tabindex válido
          const focusable = slide.querySelector(
            'input, button, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable) (focusable as HTMLElement).focus();
        }
      });
    },
  };

  return (
    <header className="flex flex-col justify-center h-[75dvh] slider-container">
      <Slider ref={sliderRef} {...settings} className="absolute inset-0 z-0">
        <div>
          <Hero img={imagen15} description={true} />
        </div>
        <div>
          <Hero img={imagen9} />
        </div>
        <div>
          <Hero img={imagen19} />
        </div>
        <div>
          <Hero img={imagen20} />
        </div>
      </Slider>
    </header>
  );
}
