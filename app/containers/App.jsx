'use strict';

import React, {Component} from 'react';
import NavLink from '../components/NavLink'
// import {createStore} from 'redux';
// import {Provider} from 'react-redux';
// import welcome from '../reducers/welcome';

// const store = createStore(welcome);

class App extends Component {

  render() {
    return (
      <div>
        <h1>Que guay</h1>
        <ul role="nav">
          <li><NavLink to="/"  onlyActiveOnIndex={true}>Helix Scope</NavLink></li>
          <li><NavLink to="/global-scenarios">Global Scenarios</NavLink></li>
          <li><NavLink to="/countries">Countries</NavLink></li>
          <li><NavLink to="/compare">Compare</NavLink></li>
        </ul>
        {this.props.children}
      </div>
    );
  }

}

export default App;
