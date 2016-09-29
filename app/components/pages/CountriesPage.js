import React, { Component } from 'react';
import SearchBox from 'containers/common/SearchBox';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';

class CountriesPage extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.props = props;
  }

  componentDidMount() {
    this.props.getCountriesList();
  }

  render() {
    return (
      <div>
        <div className="l-banner -countries">
          <div className="row">
            <div className="column">
              <div className="c-breadcrumbs -inv">Home / Countries</div>
              <div className="c-txt-title -inv">Countries</div>
              <div className="c-txt-intro -inv">
                Whats going to happen in your country? Find out the future of your country under different scenarios.
              </div>
              <SearchBox countriesList={this.props.countriesList} />
            </div>
          </div>
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

CountriesPage.propTypes = {
  getCountriesList: React.PropTypes.func,
  countriesList: React.PropTypes.array
};

export default CountriesPage;
