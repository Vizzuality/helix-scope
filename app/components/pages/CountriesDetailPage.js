import React, { Component } from 'react';
import { Link } from 'react-router';

import CallToAction from 'components/common/CallToAction';
import InterQuartileRangeChart from 'components/charts/InterQuartileRange';
import RegularBarChart from 'components/charts/RegularBar';
import BoxAndWhiskersChart from 'components/charts/BoxAndWhiskers';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';
import {
  maizeVariables,
  irrigationVariables,
  climatologicalEcologicalVariables,
  statisticValues
} from 'constants/country';

class CountriesDetailPage extends Component {

  componentDidMount() {
    this.props.fetchInterQuartileRange('crop_yield_change_baseline', this.props.iso, 'yield');
    this.props.fetchInterQuartileRange('crop_yield_change_irrigation', this.props.iso, 'Irrigation');
    this.props.fetchRegularBar('annual_expected_flood_damage', this.props.iso, 'river_floods_ExpDam');
    this.props.fetchBoxAndWhiskers('climatological_ecological', this.props.iso);
  }

  render() {
    if (this.props.config.loading) return <LoadingSpinner />;

    let countryName = '';
    if (this.props.countriesList.length) {
      countryName = this.props.countriesList.find((elem) => (elem.iso === this.props.iso)).name;
    }

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
                info={(m, i) => `These data were created using the ${m} models of the ${i}. All yield values are relative to average yields over a baseline period of 1981–2010.`}
                variables={maizeVariables}
              />
            </div>
            <div className="column small-12 medium-6">
              <InterQuartileRangeChart
                chart="crop_yield_change_irrigation"
                info={(m, i) => `These data were created using the ${m} models of the ${i}. All yield values are relative to average yields over a baseline period of 1981–2010.`}
                title={`Change in crop yields (relative to 1981-2010 base levels) avoided under different warming scenarios due to Irrigation for ${countryName}`}
                variables={irrigationVariables}
              />
            </div>
          </div>
          <div className="row">
            <div className="column small-12 medium-6">
              <RegularBarChart
                chart="annual_expected_flood_damage"
                info={(m, i) => `These data were produced by the ${m} model, of the ${i}. Values are relative to avearges over the 1976–2005 period. Expected damages are annual estimated cost of flooding, estimated in millions of € (relative to 2010 value).`}
                title="Annual expected flood damages relative to 1976–2005 levels"
              />
            </div>
          </div>
          {climatologicalEcologicalVariables.map((variable) => (
            <div className="row" key={variable}>
              {statisticValues.map((value) => (
                <div className="column small-3 medium-3" key={`${variable}_${value}`}>
                  <BoxAndWhiskersChart
                    chart="climatological_ecological"
                    info="lorem ipsum placeholderum"
                    title={(v, i) => `${v} country-wide ${i} value`}
                    variable={variable}
                    value={value}
                  />
                </div>
              ))}
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
