import PropTypes from 'prop-types';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';

import BaseChart from './BaseChart';
import { formatSI } from 'utils/format';

class Summary extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }
    const {
      colors,
      data,
      getDomain,
      margin,
      yTicks
    } = this.props;

    const lineColor = {
      min: colors[0],
      mean: colors[1],
      max: colors[2]
    };
    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const domain = getDomain(data);

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
        .tickFormat((d) => d.swlName)
        .tickSizeOuter(0),
      y: axisLeft()
        .scale(scale.y)
        .ticks(yTicks)
        .tickFormat((d) => formatSI(d, 3))
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

    const valueLine = line()
          .x((d) => scale.x(d.swl))
          .y((d) => scale.y(d.value));

    const lines = groupBy(data, (v) => v.line);

    forEach(lines, (lineData, l) => {
      const color = lineColor[l];
      // line
      svg.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', '1px')
        .attr('d', valueLine);

      // points
      svg.selectAll('.dot')
        .data(lineData)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', color)
        .attr('cx', (d) => scale.x(d.swl))
        .attr('cy', (d) => scale.y(d.value));
    });

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('width', width)
      .attr('height', 20)
      .attr('transform', 'translate(0, 0)');

    legend.selectAll('circle')
      .data(Object.keys(lines))
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d, i) => i * 60)
      .attr('cy', height + 50)
      .attr('fill', (d) => lineColor[d]);

    legend.selectAll('text')
      .data(Object.keys(lines))
      .enter()
      .append('text')
      .attr('x', (d, i) => (i * 60) + 8)
      .attr('y', height + 55)
      .text((d) => d);
  }
}

Summary.propTypes = {
  ...BaseChart.propTypes,
  colors: PropTypes.array.isRequired,
  iso: PropTypes.string.isRequired,
  yTicks: PropTypes.number,
  chart: PropTypes.string.isRequired
};

Summary.defaultProps = {
  ...BaseChart.defaultProps,
  margin: {
    left: 30,
    right: 30,
    top: 30,
    bottom: 60
  },
  meta: {},
  yTicks: 5
};

export default Summary;
