import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide1() {
  return (
    <TextSlide
      title="About the project"
      content="Helixscope is designed to show some of the results from the Helix project. It is designed to show how impacts change under different levels of warming at 2°C, 4°C and 6°C of global warming (specific warming levels of SWLs). It allows the user to look at impacts and climate change at a country level, and to compare different impacts."
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
