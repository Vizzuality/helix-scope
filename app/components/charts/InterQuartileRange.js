import PropTypes from 'prop-types';
import { axisBottom, axisLeft } from 'd3-axis';
import groupBy from 'lodash/groupBy';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';

import BaseChart from './BaseChart';
import { formatSI } from 'utils/format';
import { renderLegend, renderTooltip } from 'utils/chart-rendering';

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
      unit,
      variables,
      yTicks
    } = this.props;

    const findScenario = (slug) => scenarios.find((s) => slug.toString() === s.slug) || {};
    const findVariable = (slug) => variables.find((v) => v.variable === slug) || {};
    const colorForScenario = (slug) => findScenario(slug).color;
    const colorForVariable = (variable) => findVariable(variable).color || 'black';
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
      .attr('fill', (d) => colorForVariable(d.variable))
      .attr('cx', (d) => scale.x(d.swl))
      .attr('cy', (d) => scale.y(d.median));

    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('line')
      .attr('stroke', (d) => colorForVariable(d.variable))
      .attr('stroke-width', 2)
      .attr('x1', (d) => scale.x(d.swl))
      .attr('y1', (d) => scale.y(d.median - d.iqr))
      .attr('x2', (d) => scale.x(d.swl))
      .attr('y2', (d) => scale.y(d.median + d.iqr));

    const groupedByScenario = groupBy(data, (v) => v.swl);
    const hoverData = Object.keys(groupedByScenario).map((swl) => ({
      swl,
      variables: groupedByScenario[swl]
    }));
    const renderVariableHtml = (v) => (`
      <p>
        <b><span class="small-circle" style="background: ${colorForVariable(v.variable)};"></span>&nbsp;${findVariable(v.variable).label}: </b>
        ${formatSI(v.median, 2)}${unit} (IQR: ${formatSI(v.iqr, 2)}${unit})
      </p>
    `);
    const orderByMedianDesc = (array) => [...array].sort((a, b) => b.median - a.median);
    const hoverBoxWidth = Math.min(150, (width / 3) - 20);
    renderTooltip(this.chart, hoverData, {
      appendTo: svg,
      width: hoverBoxWidth,
      height,
      getHoverColor: (d) => colorForScenario(d.swl),
      getX: (d) => scale.x(d.swl),
      getTooltipHtml: (d) => orderByMedianDesc(d.variables).map(renderVariableHtml).join('')
    });

    renderLegend({
      appendTo: svg,
      width,
      height: 20,
      position: { x: 0, y: height + 50 },
      series: variables
    });
  }
}

InterQuartileRange.propTypes = {
  ...BaseChart.propTypes,
  chart: PropTypes.string.isRequired,
  scenarios: PropTypes.array.isRequired,
  unit: PropTypes.string.isRequired,
  variables: PropTypes.array.isRequired,
  yTicks: PropTypes.number
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
