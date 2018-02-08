import React, { Component } from 'react';
import Select from 'react-select';
import get from 'lodash/get';
import { Link } from 'react-router';

import InterQuartileRangeChart from 'containers/charts/InterQuartileRange';
import RegularBarChart from 'containers/charts/RegularBar';
import BoxAndWhiskersChart from 'containers/charts/BoxAndWhiskers';
import SummaryChart from 'containers/charts/Summary';
import {
  maizeVariables,
  irrigationVariables
} from 'constants/country';
import InfoButton from 'components/charts/InfoButton';
import MeasureSelector from 'components/maps/MeasureSelector';

class DisplayCharts extends Component {
  constructor(props) {
    super(props);

    this.state = { ...this.getInitialState(props) };

    this.handleChartChange = this.handleChartChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
  }

  getInitialState(props) {
    const selectedChart = get(props, 'charts[0]');
    const selectedMeasure = this.getDefaultMeasure(selectedChart);

    return {
      selectedChart,
      selectedMeasure
    };
  }

  getDefaultMeasure(chart) {
    const chartMeasures = (chart.measurements || [chart.measurement]).filter(m => m);
    const measurementSlug = chartMeasures.find((m) => m === 'mean') || chartMeasures[0];
    return this.props.measurements.find((m) => m.slug === measurementSlug);
  }

  handleChartChange(chart) {
    const selectedMeasure = this.getDefaultMeasure(chart);

    this.setState({
      selectedChart: chart,
      selectedMeasure
    });
  }

  handleMeasureChange(measure) {
    this.setState({ selectedMeasure: measure });
  }

  renderChart(chart, country) {
    const { selectedMeasure } = this.state;
    const props = {
      chart: chart.slug,
      iso: country.iso,
      variable: chart.variable
    };

    switch (chart.slug) {
      case 'crop_yield_change_baseline':
        return <InterQuartileRangeChart {...props} variables={maizeVariables} />;
      case 'crop_yield_change_irrigation':
        return <InterQuartileRangeChart {...props} variables={irrigationVariables} />;
      case 'annual_expected_flood_damage':
      case 'population_affected_anually':
        return <RegularBarChart {...props} />;
      case 'climatological_ecological':
        return (
          <BoxAndWhiskersChart
            {...props}
            value={selectedMeasure.slug}
          />
        );
      default:
        if (chart.slug.endsWith('_summary')) {
          return <SummaryChart {...props} colors={chart.colors} />;
        }

        return null;
    }
  }

  render() {
    const { charts, chartData, measurements, country } = this.props;
    const { selectedChart, selectedMeasure } = this.state;

    if (!charts || !charts.length) return null;

    const selectedChartData = get(chartData, `[${selectedChart.slug}][${country.iso}].data`);
    const availableMeasurements = get(selectedChart, 'measurements.length') && measurements.filter(
      (m) => selectedChart.measurements.includes(m.slug)
    );

    return (
      <div className="c-display-chart">
        <div className="header">
          {charts.length > 1 ? (
            <Select
              className="c-react-select -white"
              options={charts}
              value={selectedChart}
              onChange={this.handleChartChange}
              clearable={false}
              searchable={false}
              labelKey="label"
              valueKey="label"
            />
          ) : (
             selectedChart.label
          )}
          {selectedChart.mapViewLink && <Link to={selectedChart.mapViewLink}>MAP VIEW</Link>}
          {availableMeasurements && (
            <MeasureSelector
              measure={selectedMeasure}
              measurements={availableMeasurements}
              onChange={this.handleMeasureChange}
            />
          )}
          {selectedChart.info && (
            <InfoButton text={selectedChart.info(selectedChartData, get(selectedMeasure, 'name'))} />
          )}
        </div>
        <div className="content">
          {this.renderChart(selectedChart, country)}
        </div>
      </div>
    );
  }
}

DisplayCharts.propTypes = {
  charts: React.PropTypes.array.isRequired,
  chartData: React.PropTypes.any,
  country: React.PropTypes.object.isRequired,
  measurements: React.PropTypes.array
};

export default DisplayCharts;
