import React from 'react';
import Slider from 'react-slick';
import HomeSlide1 from './slides/HomeSlide1';
import HomeSlide2 from './slides/HomeSlide2';
import HomeSlide3 from './slides/HomeSlide3';
import HomeSlide4 from './slides/HomeSlide4';
import HomeSlide5 from './slides/HomeSlide5';
import HomeSlide6 from './slides/HomeSlide6';

function HomeSlider() {
  const settings = {
    className: 'c-home-slider',
    arrows: false,
    autoplay: true,
    adaptiveHeight: true,
    dots: true,
    autoplaySpeed: 8000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    focusOnSelect: true
  };

  return (
    <Slider {...settings}>
      <div key="1" className="slide-1">
        <HomeSlide1 />
      </div>
      <div key="2" className="slide-2">
        <HomeSlide2 />
      </div>
      <div key="3" className="slide-3">
        <HomeSlide3 />
      </div>
      <div key="4" className="slide-4">
        <HomeSlide4 />
      </div>
      <div key="5" className="slide-5">
        <HomeSlide5 />
      </div>
      <div key="6" className="slide-6">
        <HomeSlide6 />
      </div>
    </Slider>
  );
}

export default HomeSlider;

HomeSlider.propTypes = {
};
