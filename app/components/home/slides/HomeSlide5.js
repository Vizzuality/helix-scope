import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide5() {
  return (
    <TextSlide
      title="Temperatures have increased in Brazil by 1.5ºC"
      content="If the global temperature increases by 4ºC, more than 60% of the planet species studied become increasingly vulnerable to extinction. If we change our behaviour and limit warming to 2ºC the risk it halved."
      buttons={[
        {
          text: 'View Brazil data',
          link: '/global-scenarios/-7.84/-54.14/4?maps=45,climate,avg_temperature_change,max/45,climate,avg_temperature_change,mean/45,climate,avg_temperature_change,min/45,climate,avg_temperature_change,sd'
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
