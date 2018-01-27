import React from 'react';
import * as d3 from 'd3';
import uniqBy from 'lodash/uniqBy';

import BaseChart from './BaseChart';
import InfoButton from './InfoButton';

class RegularBar extends BaseChart {
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
      y: d3.extent(remote.data, (d) => d.value)
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

    const barWidth = 50;

    const chart = d3.select(this.chart);
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
      .append('rect')
      .attr('fill', (d) => colorFor(d.swl))
      .attr('x', (d) => scale.x(d.swl) - (barWidth / 2))
      .attr('y', (d) => scale.y(d.value))
      .attr('width', barWidth)
      .attr('height', (d) => height - scale.y(d.value) - 1);
  }

  render() {
    const models = uniqBy(this.props.remote.data, (d) => d.model).join(', ');
    const institutions = uniqBy(this.props.remote.data, (d) => d.institution).join(', ');
    const infoText = this.props.info(models, institutions);

    return (
      <div className="c-chart">
        <InfoButton text={infoText} />
        <div className="title">{this.props.title}</div>
        {!this.props.remote.loading ?
          (<div className="chart" ref={(ref) => { this.chart = ref; }}></div>) :
          (<div className="content subtitle">Loading</div>)}
      </div>
    );
  }
}

RegularBar.propTypes = {
  ...BaseChart.propTypes,
  iso: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  info: React.PropTypes.func.isRequired,
  scenarios: React.PropTypes.array,
  yTicks: React.PropTypes.number,
  chart: React.PropTypes.string.isRequired,
  remote: React.PropTypes.shape({
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array.isRequired
  }).isRequired
};

RegularBar.defaultProps = {
  ...BaseChart.defaultProps,
  meta: {},
  scenarios: [],
  yTicks: 5,
  remote: { loading: true, data: [] }
};

export default RegularBar;
