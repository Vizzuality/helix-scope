import React from 'react';
import HomeSlider from 'components/home/HomeSlider';
import FooterHome from 'components/common/FooterHome';

function HomePage(props) {
  return (
    <div>
      <HomeSlider {...props} />
      <FooterHome />
    </div>
  );
}

export default HomePage;
