import React, { Component } from 'react';
import Select from 'react-select';
import Footer from 'components/common/Footer';

class ComparePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Select value settings */
      disabled: false,
      searchable: false,
      clearable: false,
      optionsOne: [{ title: 'Brazil', slug: 'brazil' }, { title: 'Singapore', slug: 'singapore' }],
      optionsTwo: [{ title: 'Brazil', slug: 'brazil' }, { title: 'Singapore', slug: 'singapore' }],
      valueOne: 'Brazil',
      valueTwo: 'Singapore'
    };
    this.handleCountryOne = this.handleCountryOne.bind(this);
    this.handleCountryTwo = this.handleCountryTwo.bind(this);
  }

  handleCountryOne(newValue) {
    this.setState({
      valueOne: newValue
    });
  }

  handleCountryTwo(newValue) {
    this.setState({
      valueTwo: newValue
    });
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
            <div className="column">
              <div className="c-dropdowns -left">
                <Select
                  options={this.state.optionsOne}
                  clearable={this.state.clearable}
                  disabled={this.state.disabled}
                  value={this.state.valueOne}
                  onChange={this.handleCountryOne}
                  searchable={this.state.searchable}
                  labelKey="title"
                  valueKey="slug"
                  placeholder="Choose country"
                />
                <Select
                  options={this.state.optionsTwo}
                  clearable={this.state.clearable}
                  disabled={this.state.disabled}
                  value={this.state.valueTwo}
                  onChange={this.handleCountryTwo}
                  searchable={this.state.searchable}
                  labelKey="title"
                  valueKey="slug"
                  placeholder="Choose country"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="l-page-content">
        </div>
        <Footer className="l-footer" />
      </div>
    );
  }
}

export default ComparePage;
