import React from 'react';
import Select from 'react-select';
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
          name="countries-search-list"
          arrowRenderer={() => <Button style="primary" size="large" icon="search" position="right" />}
          clearable={false}
          value={this.state.valueSelected}
          options={this.props.countriesList}
          onChange={this.onSelectChange}
          placeholder="Type country name"
          searchPromptText="Type country name"
          labelKey="name"
          valueKey="iso"
        />
      </div>
    );
  }
}

SearchBox.propTypes = {
  countriesList: React.PropTypes.array,
  goToCountry: React.PropTypes.func.isRequired
};

export default SearchBox;
