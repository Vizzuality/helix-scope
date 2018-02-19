import PropTypes from 'prop-types';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';

import { formatSI } from 'utils/format';
import { renderTooltip } from 'utils/chart-rendering';
import BaseChart from './BaseChart';

class BoxAndWhiskers extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }

    const {
      data,
      domain,
      margin,
      scenarios,
      unit,
      yTicks
    } = this.props;

    const findScenario = (slug) => (scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (slug) => findScenario(slug).name;
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

    const chart = select(this.chart);
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
      .data(data)
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

    // hover box
    const hoverBoxWidth = Math.min(100, (width / 3) - 20);

    renderTooltip({
      appendTo: svg,
      chart,
      data,
      width: hoverBoxWidth,
      height,
      getHoverColor: (d) => colorFor(d.swl),
      getPositionX: (d) => scale.x(d.swl),
      getTooltipHtml: (d) => (`
        <p><b>maximum: </b>${formatSI(d.maximum, 2)} ${unit}</p>
        <p><b>q3: </b>${formatSI(d.q3, 2)} ${unit}</p>
        <p><b>median: </b>${formatSI(d.median, 2)} ${unit}</p>
        <p><b>q1: </b>${formatSI(d.q1, 2)} ${unit}</p>
        <p><b>minimum: </b>${formatSI(d.minimum, 2)} ${unit}</p>
      `)
    });
  }
}

BoxAndWhiskers.propTypes = {
  ...BaseChart.propTypes,
  chart: PropTypes.string.isRequired,
  iso: PropTypes.string.isRequired,
  measure: PropTypes.string.isRequired,
  scenarios: PropTypes.array.isRequired,
  unit: PropTypes.string.isRequired,
  variable: PropTypes.string.isRequired,
  yTicks: PropTypes.number
};

BoxAndWhiskers.defaultProps = {
  ...BaseChart.defaultProps,
  scenarios: [],
  yTicks: 5
};

export default BoxAndWhiskers;
