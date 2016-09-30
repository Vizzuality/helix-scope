import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide5() {
  return (
    <TextSlide
      title="Temperatures have increased in Brazil by 1.5ºC"
      content="If the global temperature increases by 6ºC, more than 60% of the planet species studied become increasingly vulnerable to extinction. If we change our behaviour and limit warming to 2ºC the risk it halved."
      buttons={[
        {
          text: 'View Brazil data',
          link: '/global-scenarios/14.01/-76.03/5?maps=0,climate,avg-precipitation/0,climate,avg-precipitation/0,climate,avg-precipitation/0,climate,avg-precipitation'
        },
        {
          text: 'Search country',
          link: '/countries'
        }
      ]}
    />
  );
}

export default HomeSlide5;
