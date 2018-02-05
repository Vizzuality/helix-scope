import React, { Component } from 'react';
import Select from 'react-select';
import get from 'lodash/get';

import InfoButton from 'components/charts/InfoButton';
import MeasureSelector from 'components/maps/MeasureSelector';

class CountryPageChart extends Component {
  constructor(props) {
    super(props);

    this.state = { ...this.getInitialState(props) };

    this.handleChartGroupChange = this.handleChartGroupChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
  }

  getInitialState(props) {
    const selectedChartGroup = get(props, 'chartGroups[0]');
    const selectedMeasure = props.measurements.find(
      (m) => m.slug === get(selectedChartGroup, 'measurements[0]')
    );

    return {
      selectedChartGroup,
      selectedMeasure
    };
  }

  handleChartGroupChange(chartGroup) {
    const selectedMeasure = this.props.measurements.find(
      (m) => m.slug === get(chartGroup, 'measurements[0]')
    );

    this.setState({
      selectedChartGroup: chartGroup,
      selectedMeasure
    });
  }

  handleMeasureChange(measure) {
    this.setState({ selectedMeasure: measure });
  }

  render() {
    const { chartGroups, chartData, measurements, country } = this.props;
    const { selectedChartGroup, selectedMeasure } = this.state;
    const selectedChart = selectedChartGroup.charts.length > 1 && selectedMeasure
                        ? selectedChartGroup.charts.find((c) => c.measurement === selectedMeasure.slug)
                        : selectedChartGroup.charts[0];
    const selectedChartData = get(chartData, `[${selectedChartGroup.slug}][${country.iso}].data`);
    const availableMeasurements = get(selectedChartGroup, 'measurements.length') && measurements.filter(
      (m) => selectedChartGroup.measurements.includes(m.slug)
    );

    return (
      <div className="c-chart-box">
        <div className="row">
          <div className="column header">
            {chartGroups.length > 1 ? (
              <Select
                className="c-react-select flexible-width-select"
                options={chartGroups}
                value={selectedChartGroup}
                onChange={this.handleChartGroupChange}
                clearable={false}
                searchable={false}
                labelKey="label"
                valueKey="slug"
              />
            ) : (
              selectedChartGroup.label
            )}
            {availableMeasurements && (
              <MeasureSelector
                measure={selectedMeasure}
                measurements={availableMeasurements}
                onChange={this.handleMeasureChange}
              />
            )}
            {selectedChart.info && (
              <InfoButton text={selectedChart.info(selectedChartData)} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="column">
            {selectedChart.component}
          </div>
        </div>
      </div>
    );
  }
}

CountryPageChart.propTypes = {
  chartGroups: React.PropTypes.array.isRequired,
  chartData: React.PropTypes.any,
  category: React.PropTypes.object.isRequired,
  country: React.PropTypes.object.isRequired,
  measurements: React.PropTypes.array
};

export default CountryPageChart;
