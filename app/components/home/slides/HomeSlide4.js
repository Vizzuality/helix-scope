import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide4() {
  return (
    <TextSlide
      title="The 4.5ºC world"
      content="If the global temperature increases by 4.5ºC, more than 60% of the
      planet species studied become increasingly vulnerable to extinction. If we
      change our behaviour and limit warming to 2ºC the risk it halved."
      buttons={[
        {
          text: 'Find out more',
          link: '/global-maps/34.05/-88.73/5?maps=45,climate,avg_temperature_change,max,3/45,climate,avg_temperature_change,mean,3/45,climate,avg_temperature_change,min,3'
        }
      ]}
    />
  );
}

export default HomeSlide4;
