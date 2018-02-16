import PropTypes from 'prop-types';

import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';
import tippy from 'tippy.js';

import BaseChart from './BaseChart';
import { formatSI } from 'utils/format';

class RegularBar extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }
    const {
      data,
      domain,
      margin,
      scenarios,
      yTicks
    } = this.props;

    const findScenario = (slug) => (scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (slug) => findScenario(slug).label;
    const colorFor = (slug) => findScenario(slug).color;

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

    const barWidth = 50;

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

    const hoverBoxWidth = Math.min(150, (width / 3) - 20);
    const bar = svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('g');

    bar.append('rect')
      .attr('fill', (d) => colorFor(d.swl))
      .attr('x', (d) => scale.x(d.swl) - (barWidth / 2))
      .attr('y', (d) => scale.y(d.value))
      .attr('width', barWidth)
      .attr('height', (d) => height - scale.y(d.value));

    bar.append('rect')
      .attr('fill', (d) => colorFor(d.swl))
      .attr('x', (d) => scale.x(d.swl) - (hoverBoxWidth / 2))
      .attr('y', 0)
      .attr('width', hoverBoxWidth)
      .attr('height', height)
      .attr('class', 'hover-box')
      .attr('title', (d) => formatSI(d.value, 2));

    tippy(this.chart.querySelectorAll('.hover-box'), {
      arrow: true,
      theme: 'light'
    });
  }
}

RegularBar.propTypes = {
  ...BaseChart.propTypes,
  iso: PropTypes.string.isRequired,
  variable: PropTypes.string.isRequired,
  scenarios: PropTypes.array,
  yTicks: PropTypes.number,
  chart: PropTypes.string.isRequired
};

RegularBar.defaultProps = {
  ...BaseChart.defaultProps,
  scenarios: [],
  yTicks: 5
};

export default RegularBar;
