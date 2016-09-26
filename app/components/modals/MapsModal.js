import React, { Component } from 'react';
import Select from 'react-select';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';

class MapsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* Select value settings */
      disabled: false,
      searchable: false,
      clearable: false,
      /* initial state options for modal */
      selectedScenario: this.props.mapConfigData.scenario,
      selectedCategory: this.props.mapConfigData.category,
      selectedIndicator: this.props.mapConfigData.indicator,
      selectedDesviation: this.props.mapConfigData.desviation
    };
    this.handleScenarioChange = this.handleScenarioChange.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleIndicator = this.handleIndicator.bind(this);
    this.handleDesviation = this.handleDesviation.bind(this);
    this.setMapState = this.setMapState.bind(this);
    this.setIndicators = this.setIndicators.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedScenario: nextProps.mapConfigData.scenario,
      selectedCategory: nextProps.mapConfigData.category,
      selectedIndicator: nextProps.mapConfigData.indicator,
      selectedDesviation: nextProps.mapConfigData.desviation
    });
  }

  setMapState(map) {
    const newObj = Object.assign({}, map, {});
    if (this.props.mapSelectedId) {
      newObj.id = this.props.mapSelectedId;
    }
    this.props.setMapState(newObj);
    this.props.onSetMapModal(false);
  }

  setIndicators() {
    const indicators = this.props.config.indicators;
    const activeIndicators = [];
    let indicatorValue = this.state.selectedIndicator;
    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].categorySlug === this.state.selectedCategory) {
        activeIndicators.push(indicators[i]);
      }
    }

    if (!indicatorValue && activeIndicators.length > 0) {
      indicatorValue = activeIndicators[0].slug;
    }

    const mapState = {
      desviation: this.state.selectedDesviation,
      scenario: this.state.selectedScenario,
      category: this.state.selectedCategory,
      indicator: indicatorValue
    };
    return { activeIndicators, indicatorValue, mapState };
  }

  handleScenarioChange(newValue) {
    this.setState({
      selectedScenario: newValue
    });
  }

  handleCategory(newValue) {
    this.setState({
      selectedCategory: newValue.slug,
      selectedIndicator: null
    });
  }

  handleIndicator(newValue) {
    this.setState({
      selectedIndicator: newValue.slug
    });
  }

  handleDesviation(newValue) {
    this.setState({
      selectedDesviation: newValue.slug
    });
  }

  render() {
    const newIndicators = this.setIndicators();

    return (
      <div>
        <Modal
          className="maps"
          modalOpen={this.props.mapModalOpen}
          onSetModal={this.props.onSetMapModal}
          btnStyle="dark"
        >
          <div className="title">
            Add Scenario
          </div>
          <div className="scenarios">
          {this.props.config.scenarios.map((scenario, index) =>
            <div className={`scenario scenario-${scenario.id}`} key={scenario.id}>
              <input
                id={`scenario-${scenario.id}`}
                name="scenario"
                type="radio"
                value={scenario.id}
                checked={scenario.id === this.state.selectedScenario}
                onChange={() => this.handleScenarioChange(scenario.id)}
              />
              <label htmlFor={`scenario-${index}`}>
                {scenario.title}
              </label>
            </div>
          )}
          </div>
          <div className="text">
            Select the variables and type of impacts you would like to explore
          </div>
          <div className="actions">
          </div>
          <div className="c-dropdowns">
            <Select
              options={this.props.config.categories}
              clearable={this.state.clearable}
              disabled={this.state.disabled}
              value={this.state.selectedCategory}
              onChange={this.handleCategory}
              searchable={this.state.searchable}
              labelKey="title"
              valueKey="slug"
            />
            <Select
              options={newIndicators.activeIndicators}
              clearable={this.state.clearable}
              disabled={this.state.disabled}
              value={newIndicators.indicatorValue}
              onChange={this.handleIndicator}
              searchable={this.state.searchable}
              labelKey="title"
              valueKey="slug"
            />
            <Select
              options={this.props.config.desviations}
              clearable={this.state.clearable}
              disabled={this.state.disabled}
              value={this.state.selectedDesviation}
              onChange={this.handleDesviation}
              searchable={this.state.searchable}
              labelKey="title"
              valueKey="slug"
            />
          </div>
          <Button
            onClick={() => this.setMapState(newIndicators.mapState)}
            icon="arrow" style="primary" size="large" text="explore" color="dark"
          />
        </Modal>
      </div>
    );
  }
}

MapsModal.propTypes = {
  /**
  * Callback when closing or opening modal
  **/
  onSetMapModal: React.PropTypes.func,
  /**
  * Define whether modal is open or not
  **/
  mapModalOpen: React.PropTypes.bool,
  /**
  * Default config to populating modals
  **/
  config: React.PropTypes.shape({
    desviations: React.PropTypes.array,
    indicators: React.PropTypes.array,
    categories: React.PropTypes.array,
    scenarios: React.PropTypes.array
  }).isRequired,
  /**
  * Data of the map config
  **/
  mapConfigData: React.PropTypes.shape({
    desviation: React.PropTypes.string,
    indicator: React.PropTypes.string,
    scenario: React.PropTypes.string,
    category: React.PropTypes.string
  }),
  /**
  * Function to supply setMap action to Maps page
  **/
  setMapState: React.PropTypes.func,
  /**
  * Define selected map id
  **/
  mapSelectedId: React.PropTypes.string
};

export default MapsModal;
