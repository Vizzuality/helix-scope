import React from 'react';
import PropTypes from 'prop-types';

import SearchBox from 'containers/common/SearchBox';
import ExploreScenarios from 'components/common/ExploreScenarios';
import Footer from 'components/common/Footer';
import NewsAndInsights from 'components/news/NewsAndInsights';

function CountriesPage({ countriesList }) {
  return (
    <div>
      <div className="l-banner-large -countries">
        <div className="row">
          <div className="column">
            <div className="c-txt-title -inv">Countries and Territories </div>
            <div className="c-txt-intro -inv">
              What could happen where you live? Explore the changes projected for countries and territories for different levels of global warming.
            </div>
            <SearchBox countriesList={countriesList} />
          </div>
        </div>
      </div>
      <Footer className="l-footer" />
    </div>
  );
}

CountriesPage.propTypes = {
  countriesList: PropTypes.array
};

export default CountriesPage;
