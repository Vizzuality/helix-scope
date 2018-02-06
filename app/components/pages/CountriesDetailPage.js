import React, { Component } from 'react';
import { Link } from 'react-router';

import { getCharts } from 'utils/charts';
import { categoriesOrder } from 'constants/country';
import CountryPageChart from 'containers/charts/CountryPageChart';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';

class CountriesDetailPage extends Component {
  componentDidMount() {
    this.props.fetchBoxAndWhiskers('climatological_ecological', this.props.iso);
  }

  render() {
    if (this.props.config.loading) return <LoadingSpinner />;

    const country = this.props.countriesList && this.props.countriesList.find((c) => c.iso === this.props.iso);
    const categories = [...this.props.config.categories].sort(
      (a, b) => categoriesOrder.indexOf(a.slug) > categoriesOrder.indexOf(b.slug)
    );

    if (!country) return null;

    return (
      <div>
        <div className="l-banner -country">
          <div className="row">
            <div className="column">
              <div className="c-breadcrumbs -inv"><Link to="/countries"> &lt; Select a new country </Link> </div>
              <div className="c-txt-title -inv">{country.name}</div>
            </div>
          </div>
        </div>
        <div className="l-page-content">
          {categories.map((category, index) => (
            <div className="c-country-page-chart" key={index}>
              <div className="row">
                <div className="column">
                  <h2>{category.name}</h2>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <CountryPageChart
                    country={country}
                    charts={getCharts(category)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <CallToAction
          type="about"
          title="About the project"
          content="Helixscope is designed to show some of the results from the Helix project. It is designed to show how impacts change under different levels of warming at 2°C, 4°C and 6°C of global warming (specific warming levels of SWLs). It allows the user to look at impacts and climate change at a country level, and to compare different impacts."
        />
        <div className="l-page-modules">
          <GetUpdates />
          <ExploreScenarios />
        </div>
        <Footer className="l-footer" />
      </div>
    );
  }
}

CountriesDetailPage.propTypes = {
  config: React.PropTypes.object.isRequired,
  fetchCountryData: React.PropTypes.func.isRequired,
  fetchInterQuartileRange: React.PropTypes.func.isRequired,
  fetchRegularBar: React.PropTypes.func.isRequired,
  fetchBoxAndWhiskers: React.PropTypes.func.isRequired,
  countryData: React.PropTypes.any,
  countriesList: React.PropTypes.array,
  iso: React.PropTypes.string
};

export default CountriesDetailPage;
