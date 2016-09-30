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
    this.state = {
      selectedRegion: {
        slug: '',
        name: ''
      }
    };
    this.handleRegionChange = this.handleRegionChange.bind(this);
  }

  componentDidMount() {
    this.props.getCountryData(this.props.iso);
  }

  handleRegionChange(newValue) {
    if (newValue) {
      this.setState({
        selectedRegion: newValue
      });
    } else {
      this.setState({
        selectedRegion: {
          slug: '',
          name: ''
        }
      });
    }
  }

  render() {
    if (!this.props.countryData) return null;

    return (
      <div>
        <div className="l-banner -country">
          <div className="row">
            <div className="column">
              <div className="c-breadcrumbs -inv">Home / Countries / {this.props.iso}</div>
              <div className="c-txt-title -inv">{this.props.countryData.name}</div>
            </div>
          </div>
        </div>
        <div className="l-page-content">
          <div className="row">
            <div className="column small-12 medium-3">
              <Select
                className="c-react-select"
                options={this.props.countryData.regions}
                value={this.state.selectedRegion.slug}
                onChange={this.handleRegionChange}
                searchable={false}
                placeholder="All regions"
                labelKey="name"
                valueKey="slug"
              />
            </div>
          </div>
          <div className="row">
            <div className="column">
              <h2>Climate Impact & variables</h2>
            </div>
          </div>
          <div className="row">
            {this.props.countryData.indicators.map((indicator, index) => (
              <div className="column small-12 medium-6" key={`chart-${index}`}>
                <Chart data={indicator} />
              </div>
            ))}
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

CountriesPage.propTypes = {
  getCountryData: React.PropTypes.func,
  countryData: React.PropTypes.any,
  iso: React.PropTypes.string
};

export default CountriesPage;
