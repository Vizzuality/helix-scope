import React from 'react';
import { axisBottom, axisLeft } from 'd3-axis';
import { extent } from 'd3-array';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';

import BaseChart from './BaseChart';
import { formatSI } from 'utils/format';
import { summaryLineColors } from 'constants/colors';

class Summary extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }
    const {
      margin,
      scenarios,
      data,
      yTicks
    } = this.props;

    const uniq = (d, idx, arr) => arr.indexOf(d) === idx;
    const findScenario = (slug) => (scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (slug) => findScenario(slug).label;

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const domain = {
      x: data.map((d) => d.swl).filter(uniq),
      y: extent(data, (d) => d.value)
    };

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
        .tickFormat(formatSI)
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
      const color = summaryLineColors[l];
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
      .attr('fill', (d) => summaryLineColors[d]);

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
  iso: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array,
  yTicks: React.PropTypes.number,
  chart: React.PropTypes.string.isRequired
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
  scenarios: [],
  yTicks: 5
};

export default Summary;
