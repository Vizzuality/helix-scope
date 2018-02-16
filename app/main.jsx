import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';

import { fetchConfig } from 'actions/config';
import { fetchCountryList } from 'actions/countries';
import * as reducers from 'reducers';
import Routes from './Routes';

import ReactGA from 'react-ga';

import './styles/lib/custom-foundation.css';
import './styles/main.pcss';
import '../node_modules/tippy.js/dist/themes/light.css';

/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  ...reducers,
  routing: routerReducer
});

/**
 * Global state
 * @info(http://redux.js.org/docs/basics/Store.html)
 * @type {Object}
 */
const middlewareRouter = routerMiddleware(browserHistory);
const store = createStore(
  reducer,
  compose(
    /* The router middleware MUST be before thunk otherwise the URL changes
    * inside a thunk function won't work properly */
    applyMiddleware(middlewareRouter, thunk),
    /* Redux dev tool, install chrome extension in
     * https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en */
    process.env.NODE_ENV === 'development' && typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )
);

/**
 * HTML5 History API managed by React Router module
 * @info(https://github.com/reactjs/react-router/tree/master/docs)
 * @type {Object}
 */
const history = syncHistoryWithStore(browserHistory, store);

// Google Analytics
if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.GA);
}

render(
  <Provider store={store}>
    {/* Tell the Router to use our enhanced history */}
    <Routes history={history} />
  </Provider>,
  document.getElementById('app')
);

store.dispatch(fetchConfig());
store.dispatch(fetchCountryList());
