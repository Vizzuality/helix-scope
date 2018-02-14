import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { StickyContainer, Sticky } from 'react-sticky';

import { categoriesOrder } from 'constants/country';
import ChartComparer from 'components/charts/ChartComparer';
import Switch from 'components/common/Switch';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';

class CompareResultsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getSelectedCountries(this.props),
      selectedChartByCategory: {},
      selectedIndex: 1
    };
    this.handleCountry1Change = this.handleCountryChange.bind(this, 'selectedCountry1');
    this.handleCountry2Change = this.handleCountryChange.bind(this, 'selectedCountry2');
    this.handleIndexCountryChange = this.handleIndexCountryChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.countriesList !== this.props.countriesList) {
      this.setState(this.getSelectedCountries(nextProps));
    }
  }

  getSelectedCountries(props) {
    const notFound = { iso: '', name: '' };
    return {
      selectedCountry1: props.countriesList.find(elem => elem.iso === this.props.iso1) || notFound,
      selectedCountry2: props.countriesList.find(elem => elem.iso === this.props.iso2) || notFound
    };
  }

  handleIndexCountryChange(newIndex) {
    if (newIndex && newIndex !== this.state.selectedIndex) {
      this.setState({
        selectedIndex: newIndex
      });
    }
  }

  handleCountryChange(country, newValue) {
    if (newValue) {
      this.setState({
        [country]: newValue
      }, () => this.updateCountryParams());
    }
  }

  updateCountryParams() {
    this.props.updateCompareUrl(this.state.selectedCountry1.iso, this.state.selectedCountry2.iso);
  }

  render() {
    if (this.props.config.loading) return <LoadingSpinner />;

    const { selectedCountry1, selectedCountry2, selectedIndex } = this.state;

    const countriesSelected = [selectedCountry1.name, selectedCountry2.name];
    const categories = [...this.props.config.categories].sort(
      (a, b) => categoriesOrder.indexOf(a.slug) > categoriesOrder.indexOf(b.slug)
    );

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
                    searchable
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
                    searchable
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
                    selectedIndex={this.state.selectedIndex}
                    onSwitch={this.handleIndexCountryChange}
                  />
                </div>
              </div>
            </Sticky>
            <div className="l-split">
              <div>
                {categories.map((category, index) => (
                  <ChartComparer
                    key={index}
                    category={category}
                    chartData={this.props.chartData}
                    country1={selectedCountry1}
                    country2={selectedCountry2}
                    selectedIndex={selectedIndex}
                    measurements={this.props.config.measurements}
                  />
                ))}
              </div>
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

CompareResultsPage.propTypes = {
  config: PropTypes.shape({
    categories: PropTypes.array,
    loading: PropTypes.bool,
    measurements: PropTypes.array
  }).isRequired,
  countriesList: PropTypes.array,
  updateCompareUrl: PropTypes.func,
  chartData: PropTypes.any,
  iso1: PropTypes.string,
  iso2: PropTypes.string
};

export default CompareResultsPage;
