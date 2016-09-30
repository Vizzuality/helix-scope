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
          <NavLink to="global-scenarios/25.657/-102.299/3?maps=15,climate,precipitation,max">1.5°C</NavLink>
        </div>
        <div className="column shrink scenario">
          <NavLink to="global-scenarios/25.657/-102.299/3?maps=2,climate,precipitation,max">2°C</NavLink>
        </div>
        <div className="column shrink scenario">
          <NavLink to="global-scenarios/25.657/-102.299/3?maps=45,climate,precipitation,max">4.5°C</NavLink>
        </div>
      </div>
    </div>
  );
}

export default ExploreScenarios;
