import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import Button from 'components/common/Button';

class CompareSelects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Select value settings */
      country1: '',
      country2: ''
    };
    this.handleCountry1 = this.handleCountry1.bind(this);
    this.handleCountry2 = this.handleCountry2.bind(this);
    this.excludeSelectedOptions1 = this.excludeSelectedOptions1.bind(this);
    this.excludeSelectedOptions2 = this.excludeSelectedOptions2.bind(this);
    this.goToCompareDetail = this.goToCompareDetail.bind(this);
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

  excludeSelectedOptions1(option) {
    return option.iso !== this.state.country2.iso;
  }
  excludeSelectedOptions2(option) {
    return option.iso !== this.state.country1.iso;
  }

  goToCompareDetail() {
    if (this.state.country1.iso && this.state.country2.iso) {
      this.props.goToCompareDetail(this.state.country1.iso, this.state.country2.iso);
    }
  }

  render() {
    if (this.props.countriesList.length === 0) return null;

    return (
      <div className="row">
        <div className={`column ${this.props.inline ? 'small-12 medium-4' : 'small-12 medium-6'}`}>
          <Select
            className="c-react-select"
            options={this.props.countriesList.filter(this.excludeSelectedOptions1)}
            value={this.state.country1.iso}
            onChange={this.handleCountry1}
            clearable={false}
            searchable
            labelKey="name"
            valueKey="iso"
            placeholder="Choose country or territory"
          />
        </div>
        <div className={`column ${this.props.inline ? 'small-12 medium-4' : 'small-12 medium-6'}`}>
          <Select
            className="c-react-select"
            options={this.props.countriesList.filter(this.excludeSelectedOptions2)}
            value={this.state.country2.iso}
            onChange={this.handleCountry2}
            clearable={false}
            searchable
            labelKey="name"
            valueKey="iso"
            placeholder="Choose country or territory"
          />
        </div>
        <div className={`column ${this.props.inline ? 'small-12 medium-4' : 'small-12 medium-12'}`}>
          <Button
            icon="arrow"
            style="primary"
            size="large"
            position={this.props.inline ? 'left' : ''}
            onClick={this.goToCompareDetail}
            text={this.props.inline ? 'Compare' : 'Compare this countries'}
          />
        </div>
      </div>
    );
  }
}

CompareSelects.propTypes = {
  goToCompareDetail: PropTypes.func,
  countriesList: PropTypes.array,
  inline: PropTypes.bool
};

export default CompareSelects;
