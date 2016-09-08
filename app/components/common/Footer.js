import React from 'react';
import NavLink from 'components/common/NavLink';

const Footer = () => (
  <div>
    <footer className="c-footer">
      <img src="/images/helixLogo_negative.png" className="footer-logo"/>
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
    </footer>
  </div>
);

export default Footer;
