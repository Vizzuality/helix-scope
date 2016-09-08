import React, {Component} from 'react';
import Select from 'react-select';
import Button from 'components/common/Button';

class AddModal extends Component {
  constructor() {
    super();
    this.state = {
      category: null,
      disabled: false,
      searchable: false,
      selectValue: null,
      clearable: false
    };
    this.handleCategory = this.handleCategory.bind(this);
    this.handleIndicator = this.handleIndicator.bind(this);
  }
  handleCategory(newValue) {
    this.props.onIndicatorsCategoryChange(newValue);
    this.setState({
      category: newValue.slug
    });
  }
  handleIndicator(newValue) {
    this.props.onIndicatorChange(newValue);
    this.setState({
      selectValue: newValue.slug
    });
  }

  render() {
    const {selectedIndicators,
      indicatorsCategories,
      scenarios,
      selectedScenario,
      onAddClick,
      onHideModal,
      onScenarioChange,
      onIndicatorsCategoryChange,
      onIndicatorChange} = {...this.props};
    return (
      <div className="c-add-modal">
        <div className="modal-box">
          <Button onClick={onHideModal} icon="close" style="light" size="small" position="right"/>
          <h2>Add Scenario</h2>
          <div className="scenarios">
          {scenarios.map((scenario, index) =>
            <div className={`scenario scenario-${index}`} key={scenario}>
              <input
                id={`scenario-${index}`}
                name="scenario"
                type="radio"
                value={scenario}
                checked={scenario === selectedScenario}
                onChange={onScenarioChange}
                />
              <label htmlFor={`scenario-${index}`}>
                {scenario}
              </label>
            </div>
          )}
          </div>

          <div className="text">
            <p>Select the variables and type of impacts you would like to explore</p>
          </div>
          <div className="c-dropdowns">
            <Select
              options={this.props.indicatorsCategories}
              clearable={this.state.clearable}
              disabled={this.state.disabled}
              value={this.state.category}
              onChange={this.handleCategory}
              searchable={this.state.searchable}
              labelKey="title"
              valueKey="slug"
              />
            <Select
              options={this.props.selectedIndicators}
              clearable={this.state.clearable}
              disabled={this.state.disabled}
              value={this.state.selectValue}
              onChange={this.handleIndicator}
              searchable={this.state.searchable}
              labelKey="title"
              valueKey="slug"
              />
          </div>
          <div className="text" style={{display: 'none'}}>
            {indicatorsCategories.map(indicatorsCategory =>
              <div key={indicatorsCategory.slug} onClick={onIndicatorsCategoryChange} data-slug={indicatorsCategory.slug}>
                {indicatorsCategory.title}
              </div>
            )}
            <p>Indicators:</p>
            {selectedIndicators.map(indicator =>
              <div key={indicator.slug} onClick={onIndicatorChange} data-slug={indicator.slug}>
                {indicator.title}
              </div>
            )}
          </div>
          <Button onClick={onAddClick} icon="arrow" style="primary" size="large" text="explore" color="dark"/>
        </div>
      </div>
    );
  }
}

AddModal.propTypes = {
  selectedIndicators: React.PropTypes.array,
  indicatorsCategories: React.PropTypes.array,
  scenarios: React.PropTypes.array,
  selectedScenario: React.PropTypes.string,
  onAddClick: React.PropTypes.func,
  onHideModal: React.PropTypes.func,
  onScenarioChange: React.PropTypes.func,
  onIndicatorsCategoryChange: React.PropTypes.func,
  onIndicatorChange: React.PropTypes.func
};

export default AddModal;
