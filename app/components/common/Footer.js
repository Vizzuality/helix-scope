import React from 'react';
import NavLink from 'components/common/NavLink';

function Footer() {
  return (
    <footer className="l-footer">
      <div className="row align-justify align-middle c-footer">
        <div className="column small-12 medium-6">
          <img alt="Helix scope" src="/images/helixLogo_negative.png" className="footer-logo" />
        </div>
        <div className="column small-12 medium-6">
          <ul className="footer-menu">
            <li>
              <NavLink to="/partners">Partners</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/news">News</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li>
              <a href="http://helixclimate.eu" target="_blank" rel="noopener noreferrer">Helixclimate.eu</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
