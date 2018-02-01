import React from 'react';
import * as d3 from 'd3';

import BaseChart from './BaseChart';

class BoxAndWhiskers extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }

    const {
      margin,
      scenarios,
      remote,
      yTicks
    } = this.props;

    const uniq = (d, idx, arr) => arr.indexOf(d) === idx;
    const findScenario = (slug) => (scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (slug) => findScenario(slug).label;
    const colorFor = (slug) => findScenario(slug).color;

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const domain = {
      x: remote.data.map((d) => d.swl).filter(uniq),
      y: [
        Math.min.apply(null, remote.data.map((d) => d.minimum)),
        Math.max.apply(null, remote.data.map((d) => d.maximum))
      ]
    };

    const scale = {
      x: d3.scalePoint()
        .domain(domain.x)
        .range([0, width])
        .padding(1),
      y: d3.scaleLinear()
        .domain(domain.y)
        .nice()
        .range([height, 0])
    };

    const axes = {
      x: d3.axisBottom()
        .scale(scale.x)
        .tickFormat(tickFormat)
        .tickSizeOuter(0),
      y: d3.axisLeft()
        .scale(scale.y)
        .ticks(yTicks)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(10)
    };

    const chart = d3.select(this.chart);
    chart.selectAll('svg').remove();

    const svg = chart.append('svg')
        .attr('width', width + (margin.left + margin.right))
        .attr('height', height + (margin.top + margin.bottom))
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg
      .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(axes.x);

    svg.append('g')
      .attr('class', 'y axis')
      .call(axes.y);

    // each bar with whiskers (visualization element)
    const bars = svg.selectAll('.dot')
      .data(remote.data)
      .enter()
      .append('g');

    // quartiles box
    const qboxWidth = 30;
    bars.append('rect')
      .attr('stroke-width', 0)
      .attr('fill', (d) => colorFor(d.swl))
      .attr('x', (d) => scale.x(d.swl) - (qboxWidth / 2))
      .attr('y', (d) => scale.y(d.q3))
      .attr('width', qboxWidth)
      .attr('height', (d) => scale.y(d.q1) - scale.y(d.q3));

    // main range line
    bars.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', (d) => scale.x(d.swl))
      .attr('y1', (d) => scale.y(d.minimum))
      .attr('x2', (d) => scale.x(d.swl))
      .attr('y2', (d) => scale.y(d.maximum));

    // top and bottom whiskers
    const whiskerWidth = 10;
    bars.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', (d) => scale.x(d.swl) - (whiskerWidth / 2))
      .attr('y1', (d) => scale.y(d.minimum))
      .attr('x2', (d) => scale.x(d.swl) + (whiskerWidth / 2))
      .attr('y2', (d) => scale.y(d.minimum));

    // bottom whisker
    bars.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', (d) => scale.x(d.swl) - (whiskerWidth / 2))
      .attr('y1', (d) => scale.y(d.maximum))
      .attr('x2', (d) => scale.x(d.swl) + (whiskerWidth / 2))
      .attr('y2', (d) => scale.y(d.maximum));

    // median box
    const mboxWidth = 10;
    bars.append('rect')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'white')
      .attr('x', (d) => scale.x(d.swl) - (mboxWidth / 2))
      .attr('y', (d) => scale.y(d.median) - (mboxWidth / 2))
      .attr('width', mboxWidth)
      .attr('height', mboxWidth);
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

BoxAndWhiskers.propTypes = {
  ...BaseChart.propTypes,
  iso: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array,
  indicatorName: React.PropTypes.string,
  indicatorLongName: React.PropTypes.string,
  measurementName: React.PropTypes.string,
  yTicks: React.PropTypes.number,
  chart: React.PropTypes.string,
  variable: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  remote: React.PropTypes.shape({
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array.isRequired
  }).isRequired
};

BoxAndWhiskers.defaultProps = {
  ...BaseChart.defaultProps,
  meta: {},
  scenarios: [],
  yTicks: 5,
  remote: { loading: true, data: [] }
};

export default BoxAndWhiskers;
