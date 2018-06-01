import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide2() {
  return (
    <TextSlide
      title="Explore the impacts of the 1.5ºC scenario in coastal regions"
      content="A global temperature increase of 1.5ºC could lead to substantial melting
      of the Greenland ice sheet, leading to sea level rise of nearly 50cm. Look at the impact on Florida"
      buttons={[
        {
          text: 'Find out more',
          link: '/global-maps/32.47/-50.10/3?maps=15,climate,avg_temperature_change,mean,3'
        }
      ]}
    />
  );
}

export default HomeSlide2;
