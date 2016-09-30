import React from 'react';
import TextSlide from './TextSlide';

function HomeSlide3() {
  return (
    <TextSlide
      title="Arctic sea ice during winter in the 4ºC world"
      content="If the global average temperature increases by 4ºC then temperatures in the Arctic could increase by over 8ºC, which means winter sea ice cover may decline by 47%."
      buttons={[
        {
          text: 'Find out more',
          link: '/global-scenarios/32.47/-50.10/3?maps=0,climate,avg-precipitation/0,climate,avg-precipitation'
        }
      ]}
    />
  );
}

export default HomeSlide3;
