import React, { Component } from 'react';
import Select from 'react-select';
import { StickyContainer, Sticky } from 'react-sticky';
import flatMap from 'lodash/flatMap';

import { getChartsByCategory } from 'utils/charts';
import { categoriesOrder } from 'constants/country';
import DisplayCharts from 'containers/charts/DisplayCharts';
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

  renderChart(charts, country, column) {
    return (
      <div className={`column small-12 medium-6 country-${column}`}>
        <DisplayCharts country={country} charts={charts} />
      </div>
    );
  }

  renderCharts() {
    const categories = [...this.props.config.categories].sort(
      (a, b) => categoriesOrder.indexOf(a.slug) > categoriesOrder.indexOf(b.slug)
    );

    const getCharts = (category) => {
      const charts = flatMap(
        getChartsByCategory(category),
        (chart) => {
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
        }
      );

      return charts;
    };

    return (
      <div>
        {categories.map((category) => {
          const charts = getCharts(category);

          return (
            <div>
              <div className="row">
                <div className="column">
                  <h2>{category.name}</h2>
                </div>
              </div>
              <div className={`row l-compare -index-${this.state.indexSelected}`}>
                {this.renderChart(charts, this.state.selectedCountry1, 1)}
                {this.renderChart(charts, this.state.selectedCountry2, 2)}
              </div>
            </div>
          );
        })}
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
  fetchBoxAndWhiskers: React.PropTypes.func.isRequired,
  iso1: React.PropTypes.string,
  iso2: React.PropTypes.string
};

export default CountriesPage;
