import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { extent } from 'd3-array';
import get from 'lodash/get';

import DisplayCharts from 'containers/charts/DisplayCharts';
import { getChartsByCategory } from 'utils/charts';

class ChartComparer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedChart: null,
      selectedMeasure: null
    };

    this.handleChartChange = this.handleChartChange.bind(this);
    this.handleMeasureChange = this.handleMeasureChange.bind(this);
  }

  getDefaultMeasure(chart) {
    if (!chart) return null;
    const chartMeasures = (chart.measurements || [chart.measurement]).filter(m => m);
    const measurementSlug = chartMeasures.find((m) => m === 'mean') || chartMeasures[0];
    return this.props.measurements.find((m) => m.slug === measurementSlug);
  }

  computeCommonDomain(selectedChart, selectedMeasure, iso1, iso2) {
    if (!selectedChart) return null;

    const { chartData } = this.props;
    const chartId = selectedMeasure
          ? `${selectedChart.slug}_${selectedMeasure.slug}`
          : selectedChart.slug;
    const country1ChartData = get(chartData, `[${chartId}][${iso1}].data`);
    const country2ChartData = get(chartData, `[${chartId}][${iso2}].data`);

    if (!country1ChartData || !country1ChartData.length ||
        !country2ChartData || !country2ChartData.length) {
      return null;
    }

    const domain1 = selectedChart.getDomain(country1ChartData);
    const domain2 = selectedChart.getDomain(country2ChartData);

    return {
      x: domain1.x || domain2.x,
      y: extent([...domain1.y, ...domain2.y].sort())
    };
  }

  handleChartChange(chart) {
    this.setState({
      selectedChart: chart
    });
  }

  handleMeasureChange(measure) {
    this.setState({
      selectedMeasure: measure
    });
  }

  renderChart(charts, selectedChart, selectedMeasure, country, commonDomain, column) {
    return (
      <div className={`column small-12 medium-6 country-${column}`}>
        <DisplayCharts
          country={country}
          charts={charts}
          selectedChart={selectedChart}
          selectedMeasure={selectedMeasure}
          fixedDomain={commonDomain}
          onChartChange={this.handleChartChange}
          onMeasureChange={this.handleMeasureChange}
        />
      </div>
    );
  }

  render() {
    const { category, country1, country2, selectedIndex } = this.props;

    const charts = getChartsByCategory(category);
    const selectedChart = this.state.selectedChart || charts[0];
    const selectedMeasure = this.state.selectedMeasure || this.getDefaultMeasure(selectedChart);
    const commonDomain = this.computeCommonDomain(selectedChart, selectedMeasure, country1.iso, country2.iso);

    return (
      <div>
        <div className="row">
          <div className="column">
            <h2>{category.name}</h2>
          </div>
        </div>
        <div className={`row l-compare -index-${selectedIndex}`}>
          {this.renderChart(charts, selectedChart, selectedMeasure, country1, commonDomain, 1)}
          {this.renderChart(charts, selectedChart, selectedMeasure, country2, commonDomain, 2)}
        </div>
      </div>
    );
  }
}

ChartComparer.propTypes = {
  category: PropTypes.object.isRequired,
  chartData: PropTypes.object,
  country1: PropTypes.object,
  country2: PropTypes.object,
  measurements: PropTypes.array,
  selectedIndex: PropTypes.number
};

export default ChartComparer;
