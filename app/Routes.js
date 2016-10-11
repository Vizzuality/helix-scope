import React from 'react';
import { connect } from 'react-redux';
import { useScroll } from 'react-router-scroll';
import { IndexRoute, IndexRedirect, Router, Route, applyRouterMiddleware } from 'react-router';
import ContainerPage from './containers/pages/ContainerPage';
import HomePage from './components/pages/HomePage';
import MapsPage from './containers/pages/MapsPage';
import CountriesPage from './containers/pages/CountriesPage';
import CountriesDetailPage from './containers/pages/CountriesDetailPage';
import ComparePage from './containers/pages/ComparePage';
import CompareResultsPage from './containers/pages/CompareResultsPage';
import PartnersPage from './components/pages/PartnersPage';
import AboutPage from './containers/pages/AboutPage';
import NewsPage from './components/pages/NewsPage';
import ContactPage from './components/pages/ContactPage';
import ReactGA from 'react-ga';

function shouldUpdateScroll(prevRouterProps, { location }) {
  /**
   * Return whether the two pages match the regex and have the same matching
   * regex parameters
   * @param  {regex}  regex
   * @return {Boolean}
   */
  function isSamePage(regex) {
    const pathname = (prevRouterProps && prevRouterProps.location.pathname) || '';
    const nextPathname = location.pathname;

    /* We first check if the pages are concerned by the regex. If not, the route
     * isn't matching */
    const isPathnameConcerned = regex.test(pathname);
    const isNextPathnameConcerned = regex.test(nextPathname);

    if (!isPathnameConcerned || !isNextPathnameConcerned) {
      return false;
    }

    /* We then get the matching regex params and return false if there isn't
     * any */
    const routeParams = pathname.match(regex);
    const nextRouteParams = nextPathname.match(regex);

    if (!routeParams || !nextRouteParams) {
      return false;
    }

    /* We remove the first element of the arrays as it is the whole matched
     * string (i.e. the route) */
    if (routeParams.length) {
      routeParams.splice(0, 1);
    }
    if (nextRouteParams.length) {
      nextRouteParams.splice(0, 1);
    }

    const paramsCount = Math.min(routeParams.length, nextRouteParams.length);

    let doesParamsMatch = true;
    for (let i = 0, j = paramsCount; i < j; i++) {
      if (routeParams[i] !== nextRouteParams[i]) {
        doesParamsMatch = false;
        break;
      }
    }

    return doesParamsMatch;
  }

  /* Here we define all the routes for which we don't want to scroll to top if
   * both the old path and the new one match (i.e. if the global regex and the
   * regex params match the two paths) */
  const regexes = [
    // example of route
    // /\/route\/((?:[A-z]|[1-9]|-)+)(?:\/(?:.*))?/,
  ];

  for (let i = 0, j = regexes.length; i < j; i++) {
    if (isSamePage(regexes[i])) {
      return false;
    }
  }

  return true;
}

function trackPageView() {
  let currentUrl = window.location.pathname;

  if (window.location.search) {
    currentUrl += window.location.search;
  }

  ReactGA.set({ page: currentUrl });
  ReactGA.pageview(currentUrl);
}

const Routes = ({ history }) => (
  <Router
    history={history}
    render={applyRouterMiddleware(useScroll(shouldUpdateScroll))}
    onUpdate={trackPageView}
  >
    <Route path="/" component={ContainerPage}>
      <IndexRoute component={HomePage} />
      <Route path="maps">
        <IndexRedirect to="global-scenarios" />
        <Route path="global-scenarios(/:lat)(/:lng)(/:zoom)" component={MapsPage} />
      </Route>
      <Route path="global-scenarios(/:lat)(/:lng)(/:zoom)" component={MapsPage} />
      <Route path="countries">
        <IndexRoute component={CountriesPage} />
        <Route path=":iso" component={CountriesDetailPage} />
      </Route>
      <Route path="compare">
        <IndexRoute component={ComparePage} />
        <Route path=":iso1/:iso2" component={CompareResultsPage} />
      </Route>
      <Route path="partners" component={PartnersPage} />
      <Route path="about" component={AboutPage} />
      <Route path="news" component={NewsPage} />
      <Route path="contact" component={ContactPage} />
    </Route>
  </Router>
);

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
