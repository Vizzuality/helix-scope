'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import App from './containers/App.jsx';
import Home from './components/Home.jsx';
import GlobalScenarios from './components/GlobalScenarios.jsx';
import Countries from './components/Countries.jsx';
import Compare from './components/Compare.jsx';

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/global-scenarios" component={GlobalScenarios} />
      <Route path="/countries" component={Countries} />
      <Route path="/compare" component={Compare} />
    </Route>
  </Router>
), document.getElementById('app'));
