import React, { Component } from 'react';
import { Link } from 'react-router';

import CountryPageChart from 'components/charts/CountryPageChart';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';

import InterQuartileRangeChart from 'containers/charts/InterQuartileRange';
import RegularBarChart from 'containers/charts/RegularBar';
import BoxAndWhiskersChart from 'containers/charts/BoxAndWhiskers';
import {
  maizeVariables,
  irrigationVariables
} from 'constants/country';

function getCharts(category, country) {
  const onlyForCountry = (i) => i.section === 'country';

  switch (category.slug) {
    case 'ag':
      return [
        {
          slug: 'crop_yield_change_baseline',
          label: 'Projected changes in crop yields relative to 1981–2010 base-level (%)',
          info: 'Projected changes in crop yields relative to 1981–2010 base-level (%), Projected changes in crop yields relative to 1981–2010 base-level (%), Projected changes in crop yields relative to 1981–2010 base-level (%)',
          chart: (
            <InterQuartileRangeChart
              iso={country.iso}
              chart="crop_yield_change_baseline"
              variables={maizeVariables}
            />
          )
        },
        {
          slug: 'crop_yield_change_irrigation',
          label: 'Change in crop yields (relative to 1981-2010 base levels) avoided under different warming scenarios due to Irrigation (%)',
          info: 'placeholder',
          chart: (
            <InterQuartileRangeChart
              iso={country.iso}
              chart="crop_yield_change_irrigation"
              variables={irrigationVariables}
            />
          )
        }
      ];
    case 'cl':
    case 'eco':
    case 'bd':
      return category.indicators.filter(onlyForCountry).map((i) => ({
        ...i,
        label: `${i.name} (${i.unit})`,
        charts: i.measurements.reduce((acc, m) => ({
          ...acc,
          info: 'placeholder',
          [m]: (
            <BoxAndWhiskersChart
              iso={country.iso}
              chart="climatological_ecological"
              variable={i.slug}
              value={m}
            />
          )
        }), {})
      }));
    case 'w':
      return [
        {
          slug: 'annual_expected_flood_damage',
          label: 'Annual expected flood damages relative to 1976–2005 levels (millions of €)',
          info: 'placeholder',
          chart: (
            <RegularBarChart
              iso={country.iso}
              chart="annual_expected_flood_damage"
            />
          )
        },
        {
          slug: 'population_affected_anually',
          label: 'Population affected annually year from river flooding relative to 1976–2005 levels',
          info: 'placeholder',
          chart: (
            <RegularBarChart
              iso={country.iso}
              chart="population_affected_anually"
            />
          )
        }
      ];
    default:
      return category.indicators.filter(onlyForCountry);
  }
}

class CountriesDetailPage extends Component {

  componentDidMount() {
    this.props.fetchInterQuartileRange('crop_yield_change_baseline', this.props.iso, 'yield');
    this.props.fetchInterQuartileRange('crop_yield_change_irrigation', this.props.iso, 'Irrigation');
    this.props.fetchRegularBar('annual_expected_flood_damage', this.props.iso, 'river_floods_ExpDam');
    this.props.fetchRegularBar('population_affected_anually', this.props.iso, 'river_floods_PopAff');
    this.props.fetchBoxAndWhiskers('climatological_ecological', this.props.iso);
  }

  render() {
    if (this.props.config.loading) return <LoadingSpinner />;

    const country = this.props.countriesList && this.props.countriesList.find((c) => c.iso === this.props.iso);

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
          {this.props.config.categories.map((category, index) => (
            <CountryPageChart
              category={category}
              country={country}
              charts={getCharts(category, country)}
              measurements={this.props.config.measurements}
              key={index}
            />
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
