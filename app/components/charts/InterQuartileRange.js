import PropTypes from 'prop-types';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';

import BaseChart from './BaseChart';
import { formatSI } from 'utils/format';

class InterQuartileRange extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }

    const {
      data,
      domain,
      margin,
      scenarios,
      variables,
      yTicks
    } = this.props;

    const colorFor = (variable) => (variables.find((v) => v.variable === variable) || { color: 'black' }).color;
    const findScenario = (slug) => (scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (val) => (findScenario(val).name);

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);

    const scale = {
      x: scalePoint()
        .domain(domain.x)
        .range([0, width])
        .padding(1),
      y: scaleLinear()
        .domain(domain.y)
        .nice()
        .range([height, 0])
    };

    const axes = {
      x: axisBottom()
        .scale(scale.x)
        .tickFormat(tickFormat)
        .tickSizeOuter(0),
      y: axisLeft()
        .scale(scale.y)
        .ticks(yTicks)
        .tickFormat((d) => formatSI(d, 2))
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(10)
    };

    const chart = select(this.chart);
    chart.selectAll('svg').remove();

    const svg = chart.append('svg')
      .attr('width', width + (margin.left + margin.right))
      .attr('height', height + (margin.top + margin.bottom))
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(axes.x);

    svg.append('g')
      .attr('class', 'y axis')
      .call(axes.y);

    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', (d) => colorFor(d.variable))
      .attr('cx', (d) => scale.x(d.swl))
      .attr('cy', (d) => scale.y(d.median));

    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('line')
      .attr('stroke', (d) => colorFor(d.variable))
      .attr('stroke-width', 2)
      .attr('x1', (d) => scale.x(d.swl))
      .attr('y1', (d) => scale.y(d.median - d.iqr))
      .attr('x2', (d) => scale.x(d.swl))
      .attr('y2', (d) => scale.y(d.median + d.iqr));

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('width', width)
      .attr('height', 20)
      .attr('transform', 'translate(0, 0)');

    legend.selectAll('circle')
      .data(variables)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d, i) => i * 60)
      .attr('cy', height + 50)
      .attr('fill', (d) => d.color);

    legend.selectAll('text')
      .data(variables)
      .enter()
      .append('text')
      .attr('x', (d, i) => (i * 60) + 8)
      .attr('y', height + 55)
      .text((d) => d.label);
  }
}

InterQuartileRange.propTypes = {
  ...BaseChart.propTypes,
  variables: PropTypes.array,
  scenarios: PropTypes.array,
  yTicks: PropTypes.number,
  chart: PropTypes.string.isRequired
};

InterQuartileRange.defaultProps = {
  ...BaseChart.defaultProps,
  margin: {
    left: 30,
    right: 30,
    top: 30,
    bottom: 60
  },
  variables: [],
  scenarios: [],
  yTicks: 5
};

export default InterQuartileRange;
