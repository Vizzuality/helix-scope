import React from 'react';
import PropTypes from 'prop-types';

import SearchBox from 'containers/common/SearchBox';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import NewsAndInsights from 'components/news/NewsAndInsights';

function CountriesPage({ countriesList }) {
  return (
    <div>
      <div className="l-banner -countries">
        <div className="row">
          <div className="column">
            <div className="c-txt-title -inv">Countries</div>
            <div className="c-txt-intro -inv">
              Whats going to happen in your country? Find out the future of your country under different scenarios.
            </div>
            <SearchBox countriesList={countriesList} />
          </div>
        </div>
      </div>

      <div className="l-page-content">
        <div className="row">
          <div className="column">
            <h2>News and insights</h2>
          </div>
        </div>
        <NewsAndInsights />
      </div>

      <div className="l-page-modules">
        <GetUpdates />
        <ExploreScenarios />
      </div>
      <Footer className="l-footer" />
    </div>
  );
}

CountriesPage.propTypes = {
  countriesList: PropTypes.array
};

export default CountriesPage;
