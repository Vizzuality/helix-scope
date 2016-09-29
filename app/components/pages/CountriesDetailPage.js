import React, { Component } from 'react';
import CallToAction from 'components/common/CallToAction';

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
      <div>
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
        <CallToAction
          type="about"
          title="About the project"
          content="Helixscope is designed to show some of the results from the Helix project. It is designed to show how impacts change under different levels of warming at 2°C, 4°C and 6°C of global warming (specific warming levels of SWLs). It allows the user to look at impacts and climate change at a country level, and to compare different impacts."
        />
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
