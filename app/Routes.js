import React from 'react';
import {connect} from 'react-redux';
import {IndexRoute, Router, Route} from 'react-router';
import ContainerPage from './containers/pages/ContainerPage';
import HomePage from './containers/pages/HomePage';
import ScenariosPage from './components/pages/ScenariosPage';
import CountriesPage from './components/pages/CountriesPage';
import ComparePage from './components/pages/ComparePage';

const Routes = ({history}) => {
  return (
    <Router history={history}>
      <Route path="/" component={ContainerPage}>
        <IndexRoute component={HomePage}/>
        <Route path="scenarios" component={ScenariosPage}/>
        <Route path="countries" component={CountriesPage}/>
        <Route path="compare" component={ComparePage}/>
      </Route>
    </Router>
  );
};

Routes.propTypes = {
  history: React.PropTypes.object
};

export default connect()(Routes);
