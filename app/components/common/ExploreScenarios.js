import React from 'react';
import NavLink from 'components/common/NavLink';

function ExploreScenarios() {
  return (
    <div className="c-explore-scenarios">
      <div className="row">
        <div className="column">
          <h3>Explore the climate scenarios</h3>
        </div>
      </div>
      <div className="row align-center">
        <div className="column shrink scenario">
          <NavLink to="/global-scenarios?maps=0,climate,avg-precipitation,standard-desviation">1.5°C</NavLink>
        </div>
        <div className="column shrink scenario">
          <NavLink to="/global-scenarios?maps=1,climate,avg-precipitation,standard-desviation">2°C</NavLink>
        </div>
        <div className="column shrink scenario">
          <NavLink to="/global-scenarios?maps=2,climate,avg-precipitation,standard-desviation">4.5°C</NavLink>
        </div>
      </div>
    </div>
  );
}

export default ExploreScenarios;
