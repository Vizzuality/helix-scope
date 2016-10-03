import React, { Component } from 'react';
import Select from 'react-select';
import Chart from 'components/common/Chart';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';

class CountriesPage extends Component {
  constructor(props) {
    super(props);
    if (props.countriesList && props.countriesList.length) {
      this.state = {
        selectedCountry1: this.props.countriesList.find(elem => elem.iso === this.props.iso1),
        selectedCountry2: this.props.countriesList.find(elem => elem.iso === this.props.iso2)
      };
    } else {
      this.state = {
        selectedCountry1: { iso: '', name: '' },
        selectedCountry2: { iso: '', name: '' }
      };
    }
    this.handleCountry1Change = this.handleCountry1Change.bind(this);
    this.handleCountry2Change = this.handleCountry2Change.bind(this);
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

  handleCountry1Change(newValue) {
    if (newValue) {
      this.setState({
        selectedCountry1: newValue
      });
    }
  }

  handleCountry2Change(newValue) {
    if (newValue) {
      this.setState({
        selectedCountry2: newValue
      });
    }
  }

  render() {
    if (!this.props.countryData1 || !this.props.countryData2) return null;

    return (
      <div>
        <div className="l-banner -compare">
          <div className="row">
            <div className="column">
              <div className="c-breadcrumbs -inv">Home / Countries / Results </div>
              <div className="c-txt-title -inv">Compare results</div>
            </div>
          </div>
        </div>
        <div className="l-page-content">
          <div className="row">
            <div className="column small-12 medium-8 medium-offset-2">
              <div className="c-txt-intro -small">
                The data you are visualizing is just illustrative, the content of
                this page should not be taken as a scientific outputs from Helix.
              </div>
            </div>
          </div>
          <div className="row">
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
          <div className="row">
            {this.props.countryData1.indicators.map((indicator, index) => (
              <div className="column small-12 medium-6" key={`chart-${index}`}>
                <Chart data={indicator} />
              </div>
            ))}
          </div>
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
  countriesList: React.PropTypes.array,
  getCountryData: React.PropTypes.func,
  countryData1: React.PropTypes.any,
  countryData2: React.PropTypes.any,
  iso1: React.PropTypes.string,
  iso2: React.PropTypes.string
};

export default CountriesPage;
