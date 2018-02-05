import React, { Component } from 'react';
import Select from 'react-select';
import { StickyContainer, Sticky } from 'react-sticky';
import flatMap from 'lodash/flatMap';

import { getCharts } from 'utils/charts';
import { categoriesOrder } from 'constants/country';
import CountryPageChart from 'containers/charts/CountryPageChart';
import Switch from 'components/common/Switch';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';

class CountriesPage extends Component {
  constructor(props) {
    super(props);
    if (props.countriesList && props.countriesList.length) {
      this.state = {
        selectedCountry1: this.props.countriesList.find(elem => elem.iso === this.props.iso1),
        selectedCountry2: this.props.countriesList.find(elem => elem.iso === this.props.iso2),
        indexSelected: 1
      };
    } else {
      this.state = {
        selectedCountry1: { iso: '', name: '' },
        selectedCountry2: { iso: '', name: '' },
        indexSelected: 1
      };
    }
    this.handleCountry1Change = this.handleCountry1Change.bind(this);
    this.handleCountry2Change = this.handleCountry2Change.bind(this);
    this.excludeSelectedOptions1 = this.excludeSelectedOptions1.bind(this);
    this.excludeSelectedOptions2 = this.excludeSelectedOptions2.bind(this);
    this.handleIndexCountryChange = this.handleIndexCountryChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchInterQuartileRange('crop_yield_change_baseline', this.props.iso1, 'yield');
    this.props.fetchInterQuartileRange('crop_yield_change_baseline', this.props.iso2, 'yield');
    this.props.fetchInterQuartileRange('crop_yield_change_irrigation', this.props.iso1, 'Irrigation');
    this.props.fetchInterQuartileRange('crop_yield_change_irrigation', this.props.iso2, 'Irrigation');
    this.props.fetchRegularBar('annual_expected_flood_damage', this.props.iso1, 'river_floods_ExpDam');
    this.props.fetchRegularBar('annual_expected_flood_damage', this.props.iso2, 'river_floods_ExpDam');
    this.props.fetchRegularBar('population_affected_anually', this.props.iso1, 'river_floods_PopAff');
    this.props.fetchRegularBar('population_affected_anually', this.props.iso2, 'river_floods_PopAff');
    this.props.fetchBoxAndWhiskers('climatological_ecological', this.props.iso1);
    this.props.fetchBoxAndWhiskers('climatological_ecological', this.props.iso2);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.countriesList !== this.props.countriesList) {
      this.setState({
        selectedCountry1: nextProps.countriesList.find(elem => elem.iso === this.props.iso1),
        selectedCountry2: nextProps.countriesList.find(elem => elem.iso === this.props.iso2)
      });
    }
  }

  handleIndexCountryChange(newIndex) {
    if (newIndex && newIndex !== this.state.indexSelected) {
      this.setState({
        indexSelected: newIndex
      });
    }
  }

  handleCountry1Change(newValue) {
    if (newValue) {
      this.setState({
        selectedCountry1: newValue
      }, () => this.updateCountryParams());
    }
  }

  handleCountry2Change(newValue) {
    if (newValue) {
      this.setState({
        selectedCountry2: newValue
      }, () => this.updateCountryParams());
    }
  }

  excludeSelectedOptions1(option) {
    return option.iso !== this.state.selectedCountry2.iso;
  }
  excludeSelectedOptions2(option) {
    return option.iso !== this.state.selectedCountry1.iso;
  }

  updateCountryParams() {
    this.props.updateCompareUrl(this.state.selectedCountry1.iso, this.state.selectedCountry2.iso);
  }

  renderChart(chart, country, column) {
    return (
      <div className={`column small-12 medium-6 country-${column}`}>
        <CountryPageChart country={country} charts={[chart]} />
      </div>
    );
  }

  renderCharts() {
    const categories = [...this.props.config.categories].sort(
      (a, b) => categoriesOrder.indexOf(a.slug) > categoriesOrder.indexOf(b.slug)
    );
    const charts = flatMap(
      categories,
      (c) => flatMap(getCharts(c), (chart) => {
        if (chart.measurements && chart.measurements.length) {
          const eachAsSeparateChart = (m) => ({
            ...chart,
            label: `${chart.label} - ${m} value`,
            measurements: null,
            measurement: m
          });
          return chart.measurements.map(eachAsSeparateChart);
        }

        return chart;
      })
    );

    return (
      <div>
        {charts.map((chart, index) => (
          <div key={index} className={`row l-compare -index-${this.state.indexSelected}`}>
          {this.renderChart(chart, this.state.selectedCountry1, 1)}
          {this.renderChart(chart, this.state.selectedCountry2, 2)}
          </div>
        ))}
      </div>
    );
  }

  render() {
    if (this.props.config.loading) return <LoadingSpinner />;

    const countriesSelected = [this.state.selectedCountry1.name, this.state.selectedCountry2.name];

    return (
      <div>
        <div className="l-banner -compare">
          <div className="row">
            <div className="column">
              <div className="c-txt-title -inv">Compare results</div>
              <div className="c-txt-intro -inv"> {this.state.selectedCountry1.name} - {this.state.selectedCountry2.name} </div>
            </div>
          </div>
        </div>
        <div className="l-page-content -no-gutter">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <div className="c-txt-intro -small">
                The data you are visualizing is just illustrative, the content of
                this page should not be taken as a scientific outputs from Helix.
              </div>
            </div>
          </div>
          <StickyContainer>
            <Sticky className="c-sticky">
              <div className="row -desktop">
                <div className="column small-12 medium-3 medium-offset-2">
                  <Select
                    className="c-react-select"
                    options={this.props.countriesList}
                    value={this.state.selectedCountry1.iso}
                    onChange={this.handleCountry1Change}
                    searchable={false}
                    clearable={false}
                    labelKey="name"
                    valueKey="iso"
                  />
                </div>
                <div className="column small-12 medium-3 medium-offset-2">
                  <Select
                    className="c-react-select"
                    options={this.props.countriesList}
                    value={this.state.selectedCountry2.iso}
                    onChange={this.handleCountry2Change}
                    searchable={false}
                    clearable={false}
                    labelKey="name"
                    valueKey="iso"
                  />
                </div>
              </div>
              <div className="row -mobile">
                <div className="column small-12">
                  <Switch
                    options={countriesSelected}
                    indexSelected={this.state.indexSelected}
                    onSwitch={this.handleIndexCountryChange}
                  />
                </div>
              </div>
            </Sticky>
            <div className="l-split">
              {this.renderCharts()}
            </div>
          </StickyContainer>
        </div>
        <CallToAction
          type="partners"
          title="Partners"
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

CountriesPage.propTypes = {
  config: React.PropTypes.shape({
    categories: React.PropTypes.array,
    loading: React.PropTypes.bool,
    measurements: React.PropTypes.array
  }).isRequired,
  countriesList: React.PropTypes.array,
  updateCompareUrl: React.PropTypes.func,
  fetchInterQuartileRange: React.PropTypes.func.isRequired,
  fetchRegularBar: React.PropTypes.func.isRequired,
  fetchBoxAndWhiskers: React.PropTypes.func.isRequired,
  iso1: React.PropTypes.string,
  iso2: React.PropTypes.string
};

export default CountriesPage;
