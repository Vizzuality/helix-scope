import React from 'react';
import { connect } from 'react-redux';
import { IndexRoute, IndexRedirect, Router, Route } from 'react-router';
import ContainerPage from './containers/pages/ContainerPage';
import HomePage from './containers/pages/HomePage';
import MapsPage from './containers/pages/MapsPage';
import CountriesPage from './containers/pages/CountriesPage';
import CountriesDetailPage from './containers/pages/CountriesDetailPage';
import ComparePage from './components/pages/ComparePage';
import PartnersPage from './components/pages/PartnersPage';
import AboutPage from './containers/pages/AboutPage';
import NewsPage from './components/pages/NewsPage';
import ContactPage from './components/pages/ContactPage';

const Routes = ({ history }) => (
  <Router history={history}>
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
      <Route path="compare" component={ComparePage} />
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
