import React, { Component } from 'react';
import SearchBox from 'containers/common/SearchBox';
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
          <div className="l-wrap">
            <div className="c-breadcrumbs">Home / Countries</div>
            <div className="c-txt-title">Countries</div>
            <div className="c-txt-intro">
              Whats going to happen in your country? Find out the future of your country under different scenarios.
            </div>
            <SearchBox countriesList={this.props.countriesList} />
          </div>
        </div>
        <div className="l-page-content">
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
