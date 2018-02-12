import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

import Button from 'components/common/Button';

class SearchBox extends React.Component {
  constructor() {
    super();
    this.state = {
      valueSelected: null
    };
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  onSelectChange(value) {
    if (value && value.iso) {
      this.props.goToCountry(value.iso);
    }
  }

  render() {
    return (
      <div className="c-search-box">
        <Select
          className="c-react-select"
          name="countries-search-list"
          arrowRenderer={() => <Button style="primary" size="large" icon="search" position="right" />}
          clearable={false}
          value={this.state.valueSelected}
          options={this.props.countriesList}
          onChange={this.onSelectChange}
          placeholder="Type country name"
          searchPromptText="Type country name"
          noResultsText="No countries found"
          labelKey="name"
          valueKey="iso"
        />
      </div>
    );
  }
}

SearchBox.propTypes = {
  countriesList: PropTypes.array,
  goToCountry: PropTypes.func.isRequired
};

export default SearchBox;
