import React, { Component } from 'react';
import Select from 'react-select';
import { StickyContainer, Sticky } from 'react-sticky';
import Switch from 'components/common/Switch';
import Chart from 'containers/common/ChartContainer';
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
    this.props.getCountryData(this.props.iso1);
    this.props.getCountryData(this.props.iso2);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.countriesList !== this.props.countriesList) {
      this.setState({
        selectedCountry1: nextProps.countriesList.find(elem => elem.iso === this.props.iso1),
        selectedCountry2: nextProps.countriesList.find(elem => elem.iso === this.props.iso2)
      });
    }
  }

  getCharts() {
    const country1Indicators = this.props.countryData1.indicators;
    const country2Indicators = this.props.countryData2.indicators;
    const maxLength = country1Indicators.length >= country2Indicators.length
      ? country1Indicators.length
      : country2Indicators.length;
    const charts = [];

    for (let i = 0; i < maxLength; i++) {
      const indicator1 = country1Indicators[i];
      const indicator2 = country2Indicators[i];
      charts.push(
        <div className="column small-12 medium-6 country-1" key={`chart-${Math.floor(Math.random() * 1000)}`}>
          {indicator1
            ? <Chart data={indicator1} iso={this.props.iso1} />
            : null
          }
        </div>
      );
      charts.push(
        <div className="column small-12 medium-6 country-2" key={`chart-${Math.floor(Math.random() * 1000)}`}>
          {indicator2
            ? <Chart data={indicator2} iso={this.props.iso2} />
            : null
          }
        </div>
      );
    }
    return charts;
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
      }, () => this.updateCountryParams(newValue.iso));
    }
  }

  handleCountry2Change(newValue) {
    if (newValue) {
      this.setState({
        selectedCountry2: newValue
      }, () => this.updateCountryParams(newValue.iso));
    }
  }

  excludeSelectedOptions1(option) {
    return option.iso !== this.state.selectedCountry2.iso;
  }
  excludeSelectedOptions2(option) {
    return option.iso !== this.state.selectedCountry1.iso;
  }

  updateCountryParams(newCountryIso) {
    this.props.getCountryData(newCountryIso);
    this.props.updateCompareUrl(this.state.selectedCountry1.iso, this.state.selectedCountry2.iso);
  }

  render() {
    if (!this.props.configLoaded || !this.props.countryData1 || !this.props.countryData2) return <LoadingSpinner />;

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
              <div className={`row l-compare -index-${this.state.indexSelected}`}>
                {this.getCharts()}
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

CountriesPage.propTypes = {
  configLoaded: React.PropTypes.bool.isRequired,
  countriesList: React.PropTypes.array,
  updateCompareUrl: React.PropTypes.func,
  getCountryData: React.PropTypes.func,
  countryData1: React.PropTypes.any,
  countryData2: React.PropTypes.any,
  iso1: React.PropTypes.string,
  iso2: React.PropTypes.string
};

export default CountriesPage;
