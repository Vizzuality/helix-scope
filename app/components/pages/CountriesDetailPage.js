import React, { Component } from 'react';
import { Link } from 'react-router';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';

import InterQuartileRangeChart from 'components/charts/InterQuartileRange';
import RegularBarChart from 'components/charts/RegularBar';
import BoxAndWhiskersChart from 'components/charts/BoxAndWhiskers';

class CountriesDetailPage extends Component {

  componentDidMount() {
    this.props.fetchCountryData(this.props.iso);
    this.props.fetchInterQuartileRange('crop_yield_change_baseline', this.props.iso, 'yield');
    this.props.fetchInterQuartileRange('crop_yield_change_irrigation', this.props.iso, 'Irrigation');
    this.props.fetchRegularBar('annual_expected_flood_damage', this.props.iso, 'river_floods_ExpDam');
    this.props.fetchBoxAndWhiskers('climatological_ecological', this.props.iso, 'tx', 'std');
  }

  render() {
    if (this.props.config.loading || !this.props.countryData) return <LoadingSpinner />;

    let countryName = '';
    if (this.props.countriesList.length) {
      countryName = this.props.countriesList.find((elem) => (elem.iso === this.props.iso)).name;
    }

    const maizeVariables = [
      {
        variable: 'Maize_yield_perc_change',
        color: '#5faacf',
        label: 'Maize'
      },
      {
        variable: 'Rice_yield_perc_change',
        color: '#c75fcf',
        label: 'Rice'
      },
      {
        variable: 'Wheat_yield_perc_change',
        color: '#5fcfa6',
        label: 'Wheat'
      },
      {
        variable: 'Soybeans_yield_perc_change',
        color: '#6d5fcf',
        label: 'Soybeans'
      }
    ];

    const irrigationVariables = [
      {
        variable: 'Maize_Irrigation_avoided_perc_change',
        color: '#5faacf',
        label: 'Maize'
      },
      {
        variable: 'Rice_Irrigation_avoided_perc_change',
        color: '#c75fcf',
        label: 'Rice'
      },
      {
        variable: 'Wheat_Irrigation_avoided_perc_change',
        color: '#5fcfa6',
        label: 'Wheat'
      },
      {
        variable: 'Soybeans_Irrigation_avoided_perc_change',
        color: '#6d5fcf',
        label: 'Soybeans'
      }
    ];

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
                chart="crop_yield_change_baseline"
                title={`Projected changes in crop yields relative to 1981–2010 base-level for ${countryName}`}
                variables={maizeVariables}
              />
            </div>
            <div className="column small-12 medium-6">
              <InterQuartileRangeChart
                chart="crop_yield_change_irrigation"
                title={`Change in crop yields (relative to 1981-2010 base levels) avoided under different warming scenarios due to Irrigation for ${countryName}`}
                variables={irrigationVariables}
              />
            </div>
          </div>
          <div className="row">
            <div className="column small-12 medium-6">
              <RegularBarChart
                chart="annual_expected_flood_damage"
                title="Annual expected flood damages relative to 1976–2005 levels"
              />
            </div>
            <div className="column small-12 medium-6">
              <BoxAndWhiskersChart
                chart="climatological_ecological"
                title="herp"
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
