import React, { Component } from 'react';

class CountriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getCountryData(this.props.slug);
  }

  render() {
    return (
      <div className="l-banner -countries">
        <div className="l-wrap">
          <div className="c-breadcrumbs">Home / Countries</div>
          <div className="c-txt-title">Countries</div>
          <div className="c-txt-intro">
            <h2>Hi ! I'm {this.props.slug}</h2>
          </div>
        </div>
      </div>
    );
  }
}

CountriesPage.propTypes = {
  getCountryData: React.PropTypes.func,
  countryData: React.PropTypes.object,
  slug: React.PropTypes.string
};

export default CountriesPage;
