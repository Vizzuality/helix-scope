import PropTypes from 'prop-types';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';
import tippy from 'tippy.js';
import uuid from 'uuid/v4';

import { formatSI } from 'utils/format';
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

    const chart = select(this.chart);
    chart.selectAll('svg').remove();
    chart.selectAll('.hover-template').remove();

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
    const hoverTemplateId = uuid();
    bars.append('rect')
      .attr('fill', (d) => colorFor(d.swl))
      .attr('x', (d) => scale.x(d.swl) - (hoverBoxWidth / 2))
      .attr('y', 0)
      .attr('width', hoverBoxWidth)
      .attr('height', height)
      .attr('class', 'hover-box')
      .attr('data-tippy-html', (d) => `#id${hoverTemplateId}_${d.swl}`.replace('.', ''));

    chart.selectAll('.hover-tooltip')
      .data(data)
      .enter()
      .append('div')
      .attr('class', '.hover-tooltip')
      .style('display', 'none')
      .attr('id', (d) => `id${hoverTemplateId}_${d.swl}`.replace('.', ''))
      .html((d) => (`
          <p><b>minimum: </b>${d.minimum}</p>
          <p><b>maximum: </b>${d.maximum}</p>
          <p><b>q1: </b>${d.q1}</p>
          <p><b>median: </b>${d.median}</p>
          <p><b>q3: </b>${d.q3}</p>
      `));

    tippy(this.chart.querySelectorAll('.hover-box'), {
      arrow: true,
      theme: 'light'
    });
  }
}

BoxAndWhiskers.propTypes = {
  ...BaseChart.propTypes,
  iso: PropTypes.string.isRequired,
  scenarios: PropTypes.array,
  yTicks: PropTypes.number,
  chart: PropTypes.string,
  variable: PropTypes.string.isRequired,
  measure: PropTypes.string.isRequired
};

BoxAndWhiskers.defaultProps = {
  ...BaseChart.defaultProps,
  scenarios: [],
  yTicks: 5
};

export default BoxAndWhiskers;
