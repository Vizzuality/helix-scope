import React, { Component } from 'react';
import { Link } from 'react-router';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';
import InterQuartileRangeChart from 'components/common/charts/InterQuartileRange';

class CountriesDetailPage extends Component {

  componentDidMount() {
    this.props.fetchCountryData(this.props.iso);
  }

  render() {
    if (!this.props.configLoaded || !this.props.countryData) return <LoadingSpinner />;

    let countryName = '';
    if (this.props.countriesList.length) {
      countryName = this.props.countriesList.find((elem) => (elem.iso === this.props.iso)).name;
    }

    const sql = `
      SELECT swl, variable,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
        PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) - PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value)  AS iqr,
        ARRAY_AGG(value ORDER BY value ASC) AS values
      FROM (
        SELECT mean as value, swl_info as swl, variable
        FROM master_admin0
        WHERE variable like '%yield%'
        AND iso = '${this.props.iso}'
        AND swl_info < 6
      ) data
      GROUP BY swl, variable
    `;

    /* eslint-disable quote-props */
    const colors = {
      'Maize_yield_perc_change': '#5faacf',
      'Rice_yield_perc_change': '#c75fcf',
      'Wheat_yield_perc_change': '#5fcfa6',
      'Soybeans_yield_perc_change': '#6d5fcf'
    };
    /* eslint-enable quote-props */

    return (
      <div>
        <div className="l-banner -country">
          <div className="row">
            <div className="column">
              <div className="c-breadcrumbs -inv"><Link to="/countries"> &lt; Select a new country </Link> </div>
              <div className="c-txt-title -inv">{countryName}</div>
            </div>
          </div>
        </div>
        <div className="l-page-content">
          <div className="row">
            <div className="column">
              <h2>Climate Impact & variables</h2>
            </div>
          </div>
          <div className="row">
            <div className="column small-12 medium-6">
              <InterQuartileRangeChart
                title={`Projected changes in crop yields relative to 1981–2010 base-level for ${countryName}`}
                sql={sql}
                colors={colors}
              />
            </div>
          </div>
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
  configLoaded: React.PropTypes.bool.isRequired,
  fetchCountryData: React.PropTypes.func,
  countryData: React.PropTypes.any,
  countriesList: React.PropTypes.array,
  iso: React.PropTypes.string
};

export default CountriesDetailPage;
