import React from 'react';

import Button from 'components/common/Button';
import FooterHome from 'components/common/FooterHome';

function HomePage() {
  return (
    <div className="l-home">
      <div className="row c-txt-home-container align-middle">
        <div className="column c-txt-home">
          <section className="content">
            <h2 className="title">About Helixscope</h2>
            <p className="text">
              HELIX (High-End cLimate Impacts and eXtremes) is a scientific research project that
              has calculated possible changes in local climates at different levels of global
              warming, and the impacts of these changes. Helixscope allows you to explore some of
              the projected impacts at 1.5°C, 2°C and 4°C global warming to see what they might mean
              for you.
            </p>
            <div className="buttons">
              <Button
                icon="arrow"
                style="primary"
                size="large"
                link="/about"
                text="Find out more"
              />
            </div>
          </section>
        </div>
      </div>
      <FooterHome />
    </div>
  );
}

export default HomePage;
