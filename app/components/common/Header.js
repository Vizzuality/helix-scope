import React from 'react';
import PropTypes from 'prop-types';

import NavLink from 'components/common/NavLink';
import Button from 'components/common/Button';

const Header = (props) => (
  <header className={`l-header ${props.mini ? '-mini' : ''}`}>
    <nav className={`row align-middle c-header ${props.mini ? '-mini' : ''}`}>
      <div className="column small-9 medium-4">
        <NavLink to="/"><img alt="Helix Scope" src="/images/Helixlogo01.png" className="icon-logo" /></NavLink>
      </div>
      <ul className="column small-3 medium-8 main-menu">
        <li>
          <NavLink to="/global-scenarios" className="-green">Global Scenarios</NavLink>
        </li>
        <li>
          <NavLink to="/countries" className="-orange">Countries</NavLink>
        </li>
        <li>
          <NavLink to="/compare" className="-red">Compare</NavLink>
        </li>
        <li>
          <Button icon="share" style="none" size="small" onClick={() => props.setShareModal(true)} />
        </li>
      </ul>
      <div className="column small-3 medium-8 mobile-menu">
        <Button icon="menu" style="none" size="small" onClick={() => props.setMenuModal(true)} />
      </div>
    </nav>
  </header>
);

Header.propTypes = {
  setMenuModal: PropTypes.func,
  setShareModal: PropTypes.func
};

export default Header;
