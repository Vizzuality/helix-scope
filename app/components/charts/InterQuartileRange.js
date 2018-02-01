import React from 'react';

import { axisBottom, axisLeft } from 'd3-axis';
import { extent } from 'd3-array';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';

import BaseChart from './BaseChart';

class InterQuartileRange extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }

    const {
      margin,
      scenarios,
      remote,
      yTicks,
      variables
    } = this.props;

    const uniq = (d, idx, arr) => arr.indexOf(d) === idx;
    const colorFor = (variable) => (variables.find((v) => v.variable === variable) || { color: 'black' }).color;
    const findScenario = (slug) => (scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (val) => (findScenario(val).name);

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);

    const domain = {
      x: remote.data.map((d) => d.swl).filter(uniq),
      y: extent(remote.data, (d) => d.median)
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
      .data(remote.data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', (d) => colorFor(d.variable))
      .attr('cx', (d) => scale.x(d.swl))
      .attr('cy', (d) => scale.y(d.median));

    svg.selectAll('.dot')
      .data(remote.data)
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

  render() {
    return (
      <div className="c-chart">
        {!this.props.remote.loading ?
          (<div className="chart" ref={(ref) => { this.chart = ref; }}></div>) :
          (<div className="content subtitle">Loading</div>)}
      </div>
    );
  }
}

InterQuartileRange.propTypes = {
  ...BaseChart.propTypes,
  variables: React.PropTypes.array,
  scenarios: React.PropTypes.array,
  yTicks: React.PropTypes.number,
  chart: React.PropTypes.string.isRequired,
  remote: React.PropTypes.shape({
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array.isRequired
  }).isRequired
};

InterQuartileRange.defaultProps = {
  ...BaseChart.defaultProps,
  margin: {
    left: 30,
    right: 30,
    top: 30,
    bottom: 60
  },
  meta: {},
  variables: [],
  scenarios: [],
  yTicks: 5,
  remote: { loading: true, data: [] }
};

export default InterQuartileRange;
