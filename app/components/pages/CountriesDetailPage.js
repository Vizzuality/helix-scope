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
        <div className="row">
          <div className="column">
            <div className="c-breadcrumbs -inv">Home / Countries / {this.props.slug}</div>
            <div className="c-txt-title -inv">Countries</div>
            <div className="c-txt-intro -inv">
              <h2>Hi ! I'm {this.props.slug}</h2>
            </div>
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
