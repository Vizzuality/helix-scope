import React from 'react';
import NavLink from 'components/common/NavLink';
import Button from 'components/common/Button';

const Header = (props) => (
  <div>
    <header>
      <nav className="c-header">
        <NavLink to="/"><img alt="Helix Scope" src="/images/Helixlogo01.png" className="icon-logo" /></NavLink>
        <ul className="main-menu">
          <li>
            <NavLink to="/global-scenarios/19.15/-60.91/3?maps=1,climate,avg-precipitation" className="-green">Global Scenarios</NavLink>
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
        <ul className="mobile-menu">
          <li>
            <Button icon="menu" style="none" size="small" onClick={() => props.setMenuModal(true)} />
          </li>
        </ul>
      </nav>
    </header>
  </div>
);

Header.propTypes = {
  setMenuModal: React.PropTypes.func,
  setShareModal: React.PropTypes.func
};

export default Header;
