import React, { Component } from 'react';
import Select from 'react-select';
import Button from 'components/common/Button';
import Modal from 'components/common/Modal';
import { DEFAULT_SEASON } from 'constants/season';

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
      selectedMeasure: this.props.mapConfigData.measure
    };
    this.handleScenarioChange = this.handleScenarioChange.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleIndicator = this.handleIndicator.bind(this);
    this.handleMeasure = this.handleMeasure.bind(this);
    this.setMapState = this.setMapState.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedScenario: nextProps.mapConfigData.scenario,
      selectedCategory: nextProps.mapConfigData.category,
      selectedIndicator: nextProps.mapConfigData.indicator,
      selectedMeasure: nextProps.mapConfigData.measure
    });
  }

  setMapState() {
    const mapState = {
      measure: this.state.selectedMeasure,
      scenario: this.state.selectedScenario,
      category: this.state.selectedCategory,
      indicator: this.state.selectedIndicator,
      season: this.props.mapConfigData.season || DEFAULT_SEASON
    };

    if (this.props.mapSelectedId) {
      mapState.id = this.props.mapSelectedId;
    }

    this.props.setMapState(mapState);
    this.props.onSetMapModal(false);
  }

  handleScenarioChange(newValue) {
    this.setState({
      selectedScenario: newValue
    });
  }

  handleCategory(newValue) {
    this.setState({
      selectedCategory: newValue,
      selectedIndicator: newValue.indicators[0]
    });
  }

  handleIndicator(newValue) {
    this.setState({
      selectedIndicator: newValue
    });
  }

  handleMeasure(newValue) {
    this.setState({
      selectedMeasure: newValue
    });
  }

  render() {
    return (
      <div>
        <Modal
          className="maps"
          modalOpen={this.props.mapModalOpen}
          onSetModal={this.props.onSetMapModal}
          btnStyle="dark"
        >
          <div className="row">
            <div className="column">
              <div className="title">
                Add Scenario
              </div>
            </div>
          </div>
          <div className="row align-center scenarios">
          {this.props.config.scenarios.map((scenario, index) =>
            <div
              key={index}
              className={`column scenario small-4 medium-3 scenario-${index}`}
            >
              <input
                id={`scenario-${index}`}
                name="scenario"
                type="radio"
                value={scenario.slug}
                checked={scenario.slug === this.state.selectedScenario.slug}
                onChange={() => this.handleScenarioChange(scenario)}
              />
              <label htmlFor={`scenario-${index}`}>
                {scenario.name}
              </label>
            </div>
          )}
          </div>
          <div className="row">
            <div className="column">
              <div className="text">
                Select the variables and type of impacts you would like to explore
              </div>
            </div>
          </div>
          <div className="row">
            <div className="column small-12 medium-4">
              <Select
                className="c-react-select"
                options={this.props.config.categories.filter((c) => c.indicators.some((i) => i.section === 'map'))}
                clearable={this.state.clearable}
                disabled={this.state.disabled}
                value={this.state.selectedCategory.slug}
                onChange={this.handleCategory}
                searchable={this.state.searchable}
                labelKey="name"
                valueKey="slug"
              />
            </div>
            <div className="column small-12 medium-4">
              <Select
                className="c-react-select"
                options={this.state.selectedCategory.indicators.filter((s) => s.section === 'map')}
                clearable={this.state.clearable}
                disabled={this.state.disabled}
                value={this.state.selectedIndicator.slug}
                onChange={this.handleIndicator}
                searchable={this.state.searchable}
                labelKey="name"
                valueKey="slug"
              />
            </div>
            <div className="column small-12 medium-4">
              <Select
                className="c-react-select"
                options={this.props.config.measurements}
                clearable={this.state.clearable}
                disabled={this.state.disabled}
                value={this.state.selectedMeasure.slug}
                onChange={this.handleMeasure}
                searchable={this.state.searchable}
                labelKey="name"
                valueKey="slug"
              />
            </div>
          </div>
          <div className="row">
            <div className="column">
              <Button
                onClick={() => this.setMapState()}
                icon="arrow" style="primary" size="large" text="explore" color="dark"
              />
            </div>
          </div>
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
    measurements: React.PropTypes.array,
    indicators: React.PropTypes.array,
    categories: React.PropTypes.array,
    scenarios: React.PropTypes.array
  }).isRequired,
  /**
  * Data of the map config
  **/
  mapConfigData: React.PropTypes.shape({
    measure: React.PropTypes.object,
    indicator: React.PropTypes.object,
    scenario: React.PropTypes.object,
    category: React.PropTypes.object,
    season: React.PropTypes.number
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
