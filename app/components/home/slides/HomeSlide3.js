import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide3() {
  return (
    <TextSlide
      title="Arctic sea ice during winter in the 2ºC world"
      content="If the global average temperature increases by 2ºC then temperatures
      in the Arctic could increase by over 8ºC, which means winter sea ice cover may decline by 47%."
      buttons={[
        {
          text: 'Find out more',
          link: '/global-scenarios/32.47/-50.10/3?maps=15,climate,avg_temperature_change,mean,3/2,climate,avg_temperature_change,mean,3'
        }
      ]}
    />
  );
}

export default HomeSlide3;
