import React from 'react';
import NavLink from 'components/common/NavLink';

function ExploreScenarios() {
  return (
    <div className="c-explore-scenarios">
      <div className="row">
        <div className="column">
          <h3>Explore the Global Maps</h3>
        </div>
      </div>
      <div className="row align-center">
        <div className="column shrink scenario">
          <NavLink to="/global-maps/0/0/3?maps=15,climate,precipitation,max,3">1.5°C</NavLink>
        </div>
        <div className="column shrink scenario">
          <NavLink to="/global-maps/0/0/3?maps=2,climate,precipitation,max,3">2°C</NavLink>
        </div>
        <div className="column shrink scenario">
          <NavLink to="/global-maps/0/0/3?maps=4,climate,precipitation,max,3">4°C</NavLink>
        </div>
      </div>
    </div>
  );
}

export default ExploreScenarios;
