import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide4() {
  return (
    <TextSlide
      title="The 6ºC world"
      content="If the global temperature increases by 6ºC, more than 60% of the planet species studied become increasingly vulnerable to extinction. If we change our behaviour and limit warming to 2ºC the risk it halved."
      buttons={[
        {
          text: 'Find out more',
          link: '/global-scenarios/34.05/-88.73/5?maps=0,climate,avg-precipitation/0,climate,avg-precipitation/0,climate,avg-precipitation'
        }
      ]}
    />
  );
}

export default HomeSlide4;
