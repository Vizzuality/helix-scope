import React, { Component } from 'react';
import Select from 'react-select';
import Button from 'components/common/Button';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';

class ComparePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Select value settings */
      disabled: false,
      searchable: false,
      clearable: false,
      country1: '',
      country2: ''
    };
    this.handleCountry1 = this.handleCountry1.bind(this);
    this.handleCountry2 = this.handleCountry2.bind(this);
    this.goToCompareDetail = this.goToCompareDetail.bind(this);
  }

  componentDidMount() {
    if (this.props.countriesList && this.props.countriesList.length === 0) {
      this.props.getCountriesList();
    }
  }

  handleCountry1(newValue) {
    this.setState({
      country1: newValue
    });
  }

  handleCountry2(newValue) {
    this.setState({
      country2: newValue
    });
  }

  goToCompareDetail() {
    if (this.state.country1.iso && this.state.country2.iso) {
      this.props.goToCompareDetail(this.state.country1.iso, this.state.country2.iso);
    }
  }

  render() {
    return (
      <div>
        <div className="l-banner -compare">
          <div className="row">
            <div className="column">
              <div className="c-breadcrumbs -inv">Home / Compare</div>
              <div className="c-txt-title -inv">Compare</div>
              <div className="c-txt-intro -inv">Climate change will affect different countries in different ways. Choose the countries you are interested in and find out the impact of the 2°C, 4°C and 6°C scenarios.</div>
            </div>
          </div>
          <div className="row">
            <div className="column small-12 medium-4">
              <Select
                className="c-react-select"
                options={this.props.countriesList}
                clearable={this.state.clearable}
                disabled={this.state.disabled}
                value={this.state.country1.iso}
                onChange={this.handleCountry1}
                searchable={this.state.searchable}
                labelKey="name"
                valueKey="iso"
                placeholder="Choose country"
              />
            </div>
            <div className="column small-12 medium-4">
              <Select
                className="c-react-select"
                options={this.props.countriesList}
                clearable={this.state.clearable}
                disabled={this.state.disabled}
                value={this.state.country2.iso}
                onChange={this.handleCountry2}
                searchable={this.state.searchable}
                labelKey="name"
                valueKey="iso"
                placeholder="Choose country"
              />
            </div>
            <div className="column small-12 medium-4">
              <Button
                icon="arrow"
                style="primary"
                size="large"
                onClick={this.goToCompareDetail}
                text="Compare"
              />
            </div>
          </div>
        </div>
        <div className="l-page-content">
        </div>
        <div className="l-page-modules">
          <GetUpdates />
          <ExploreScenarios />
        </div>
        <Footer className="l-footer" />
      </div>
    );
  }
}

ComparePage.propTypes = {
  getCountriesList: React.PropTypes.func,
  goToCompareDetail: React.PropTypes.func,
  countriesList: React.PropTypes.array
};

export default ComparePage;
