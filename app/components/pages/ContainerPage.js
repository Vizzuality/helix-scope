import React from 'react';
import NavLink from '../common/NavLink';

const ContainerPage = props => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/" onlyActiveOnIndex={true}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/scenarios">Global Scenarios</NavLink>
          </li>
          <li>
            <NavLink to="/countries">Countries</NavLink>
          </li>
          <li>
            <NavLink to="/compare">Compare</NavLink>
          </li>
        </ul>
      </nav>
      {props.children}
    </div>
  );
};

export default ContainerPage;
