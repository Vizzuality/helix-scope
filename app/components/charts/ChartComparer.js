import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { extent } from 'd3-array';
import get from 'lodash/get';
import flatMap from 'lodash/flatMap';

import DisplayCharts from 'containers/charts/DisplayCharts';
import { getChartsByCategory } from 'utils/charts';

class ChartComparer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedChart: null
    };

    this.handleChartChange = this.handleChartChange.bind(this);
  }

  getCharts(category) {
    const charts = flatMap(
      getChartsByCategory(category),
      (chart) => {
        if (chart.measurements && chart.measurements.length) {
          const eachAsSeparateChart = (m) => ({
            ...chart,
            label: `${chart.label} - ${m} value`,
            measurements: null,
            measurement: m
          });
          return chart.measurements.map(eachAsSeparateChart);
        }

        return chart;
      }
    );

    return charts;
  }

  computeCommonDomain(selectedChart, iso1, iso2) {
    if (!selectedChart) return null;

    const { chartData } = this.props;
    const chartId = selectedChart.measurement
          ? `${selectedChart.slug}_${selectedChart.measurement}`
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

  renderChart(charts, selectedChart, country, commonDomain, column) {
    return (
      <div className={`column small-12 medium-6 country-${column}`}>
        <DisplayCharts
          country={country}
          charts={charts}
          selectedChart={selectedChart}
          fixedDomain={commonDomain}
          onChartChange={this.handleChartChange}
        />
      </div>
    );
  }

  render() {
    const { category, country1, country2, selectedIndex } = this.props;

    const charts = this.getCharts(category);
    const selectedChart = this.state.selectedChart || charts[0];
    const commonDomain = this.computeCommonDomain(selectedChart, country1.iso, country2.iso);

    return (
      <div>
        <div className="row">
          <div className="column">
            <h2>{category.name}</h2>
          </div>
        </div>
        <div className={`row l-compare -index-${selectedIndex}`}>
          {this.renderChart(charts, selectedChart, country1, commonDomain, 1)}
          {this.renderChart(charts, selectedChart, country2, commonDomain, 2)}
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
  selectedIndex: PropTypes.number
};

export default ChartComparer;
