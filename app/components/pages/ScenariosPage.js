import React from 'react';
import Map from '../common/Map';
import NavLink from '../common/NavLink';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';

const ScenariosPage = props => {
  return (
    <div>
      <div className="navbar-head">
        <NavBar/>
      </div>
      Scenarios
      <ul>
        <li>
          <NavLink to="/scenarios/18.16495/-175.93939" onlyActiveOnIndex={Boolean(true)}>Sea</NavLink>
        </li>
        <li>
          <NavLink to="/scenarios/65.42272/-68.31792">Land</NavLink>
        </li>
        <li>
          <NavLink to="/scenarios/-73.64323/-40.40495">Random</NavLink>
        </li>
      </ul>
      <Map lat={props.params.lat} lng={props.params.lng}/>
      <Footer className="l-footer"/>
    </div>
  );
};

ScenariosPage.propTypes = {
  params: React.PropTypes.object,
  lat: React.PropTypes.string,
  lng: React.PropTypes.string
};

export default ScenariosPage;