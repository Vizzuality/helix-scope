import React, { Component } from 'react';
import Select from 'react-select';
import get from 'lodash/get';

import InfoButton from 'components/charts/InfoButton';
import MeasureSelector from 'components/maps/MeasureSelector';

class CountryPageChart extends Component {
  constructor(props) {
    super(props);

    this.state = { ...this.getInitialState(props) };

    this.handleChartChange = this.handleChartChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
  }

  getInitialState(props) {
    const selectedChart = get(props, 'charts[0]');
    const selectedMeasure = props.measurements.find(
      (m) => m.slug === get(selectedChart, 'measurements[0]')
    );

    return {
      selectedChart,
      selectedMeasure
    };
  }

  handleChartChange(chart) {
    const selectedMeasure = this.props.measurements.find(
      (m) => m.slug === get(chart, 'measurements[0]')
    );

    this.setState({
      selectedChart: chart,
      selectedMeasure
    });
  }

  handleMeasureChange(measure) {
    this.setState({ selectedMeasure: measure });
  }

  renderChart() {
    const { selectedChart, selectedMeasure } = this.state;
    if (selectedChart.chart) return selectedChart.chart;
    return selectedChart.charts && selectedMeasure && selectedChart.charts[selectedMeasure.slug];
  }

  render() {
    const { category, charts, measurements } = this.props;
    const { selectedChart, selectedMeasure } = this.state;
    const availableMeasurements = get(selectedChart, 'measurements.length') && measurements.filter(
      (m) => selectedChart.measurements.includes(m.slug)
    );

    return (
      <div className="c-country-page-chart">
        <div className="row">
          <div className="column">
            <h2>{category.name}</h2>
          </div>
        </div>
        <div className="row">
          <div className="column header">
            <Select
              className="c-react-select"
              options={charts}
              value={selectedChart}
              onChange={this.handleChartChange}
              clearable={false}
              labelKey="label"
              valueKey="slug"
            />
            {availableMeasurements && (
              <MeasureSelector
                measure={selectedMeasure}
                measurements={availableMeasurements}
                onChange={this.handleMeasureChange}
              />
            )}
            {selectedChart.info && <InfoButton text={selectedChart.info} />}
          </div>
        </div>
        <div className="row">
          <div className="column">
            {this.renderChart()}
          </div>
        </div>
      </div>
    );
  }
}

CountryPageChart.propTypes = {
  charts: React.PropTypes.array.isRequired,
  category: React.PropTypes.object.isRequired,
  country: React.PropTypes.object.isRequired,
  measurements: React.PropTypes.array
};

export default CountryPageChart;
