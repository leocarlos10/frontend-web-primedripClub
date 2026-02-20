
import Slider from "react-slick";
import Hero from "./Hero";
import imagen3 from "../../assets/imagen3.jpeg";
import imagen15 from "../../assets/imagen15.jpeg";
import imagen20 from "../../assets/imagen20.jpeg";
import imagen19 from "../../assets/imagen19.jpeg";

export default function SliderImg() {

    const settings = {
      dots: true,
      infinite: true,
      slidesToShow:1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: true,
      arrows: false,
    };

  return (
    <header className=" flex flex-col justify-center h-[72dvh]  slider-container">
      <Slider {...settings} className="">
        <div>
          <Hero img={imagen3} />
        </div>
        <div>
          <Hero img={imagen15} />
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
