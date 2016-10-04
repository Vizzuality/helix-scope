import React, { Component } from 'react';
import SearchBox from 'containers/common/SearchBox';
import ExploreScenarios from 'components/common/ExploreScenarios';
import GetUpdates from 'components/common/GetUpdates';
import Footer from 'components/common/Footer';
import NewsCover from 'components/news/NewsCover';

class CountriesPage extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.props = props;
  }

  componentDidMount() {
    if (this.props.countriesList && this.props.countriesList.length === 0) {
      this.props.getCountriesList();
    }
  }

  render() {
    return (
      <div>
        <div className="l-banner -countries">
          <div className="row">
            <div className="column">
              <div className="c-txt-title -inv">Countries</div>
              <div className="c-txt-intro -inv">
                Whats going to happen in your country? Find out the future of your country under different scenarios.
              </div>
              <SearchBox countriesList={this.props.countriesList} />
            </div>
          </div>
        </div>

        <div className="l-page-content">
          <div className="row">
            <div className="column">
              <h2>News and insights</h2>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <NewsCover
                title=""
                content=""
              />
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
