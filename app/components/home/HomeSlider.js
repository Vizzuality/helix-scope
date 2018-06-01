import React from 'react';
import Slider from 'react-slick';
import HomeSlide1 from './slides/HomeSlide1';


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
    </Slider>
  );
}

export default HomeSlider;

HomeSlider.propTypes = {
};
