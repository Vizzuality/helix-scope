import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide1() {
  return (
    <TextSlide
      title="About Helixscope"
      content="HELIX (High-End cLimate Impacts and eXtremes) is a scientific research project that has calculated possible changes in local climates at different levels of global warming, and the impacts of these changes. Helixscope allows you to explore some of the projected impacts at 1.5°C, 2°C and 4°C global warming to see what they might mean for you."
      buttons={[
        {
          text: 'Find out more',
          link: '/about'
        }
      ]}
    />
  );
}

export default HomeSlide1;
