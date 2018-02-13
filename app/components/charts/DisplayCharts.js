import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  getDefaultMeasure(chart) {
    if (!chart) return null;
    const chartMeasures = (chart.measurements || [chart.measurement]).filter(m => m);
    const measurementSlug = chartMeasures.find((m) => m === 'mean') || chartMeasures[0];
    return this.props.measurements.find((m) => m.slug === measurementSlug);
  }

  renderChart(chart, measure, country) {
    const props = {
      chart: chart.slug,
      getDomain: chart.getDomain,
      iso: country.iso,
      variable: chart.variable
    };

    if (chart.slug === 'crop_yield_change_baseline') {
      return <InterQuartileRangeChart {...props} variables={maizeVariables} />;
    } else if (chart.slug === 'crop_yield_change_irrigation') {
      return <InterQuartileRangeChart {...props} variables={irrigationVariables} />;
    } else if (['annual_expected_flood_damage', 'population_affected_anually'].includes(chart.slug)) {
      return <RegularBarChart {...props} />;
    } else if (chart.slug.startsWith('climatological_ecological')) {
      return (
        <BoxAndWhiskersChart
          {...props}
          measure={measure.slug}
        />
      );
    } else if (chart.slug.endsWith('_summary')) {
      return <SummaryChart {...props} colors={chart.colors} />;
    }

    return null;
  }

  render() {
    const { charts, chartData, measurements, country, onChartChange, onMeasureChange } = this.props;

    if (!charts || !charts.length) return null;

    const selectedChart = this.props.selectedChart || charts[0];
    const selectedMeasure = this.props.selectedMeasure || this.getDefaultMeasure(selectedChart);
    const selectedChartData = get(chartData, `[${selectedChart.slug}][${country.iso}].data`);
    const availableMeasurements = get(selectedChart, 'measurements.length') && measurements.filter(
      (m) => selectedChart.measurements.includes(m.slug)
    );

    return (
      <div className="c-display-chart">
        <div className="header">
          <div className="title">
            {charts.length > 1 ? (
              <Select
                className="c-react-select -white"
                options={charts}
                value={selectedChart}
                onChange={onChartChange}
                clearable={false}
                searchable={false}
                labelKey="label"
                valueKey="label"
              />
            ) : (
               selectedChart.label
            )}
            {selectedChart.mapViewLink && (
              <Link className="map-view-link" to={selectedChart.mapViewLink}>MAP VIEW</Link>
            )}
          </div>
          {availableMeasurements && (
            <MeasureSelector
              measure={selectedMeasure}
              measurements={availableMeasurements}
              onChange={onMeasureChange}
            />
          )}
          {selectedChart.getInfo && (
            <InfoButton text={selectedChart.getInfo(selectedChartData, get(selectedMeasure, 'name'))} />
          )}
        </div>
        <div className="content">
          {this.renderChart(selectedChart, selectedMeasure, country)}
        </div>
      </div>
    );
  }
}

DisplayCharts.propTypes = {
  chartData: PropTypes.any,
  charts: PropTypes.array.isRequired,
  country: PropTypes.object.isRequired,
  fixedYScale: PropTypes.array,
  measurements: PropTypes.array,
  onChartChange: PropTypes.func,
  onMeasureChange: PropTypes.func,
  selectedChart: PropTypes.object,
  selectedMeasure: PropTypes.object
};

export default DisplayCharts;
