import PropTypes from 'prop-types';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scalePoint } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import groupBy from 'lodash/groupBy';
import forEach from 'lodash/forEach';

import BaseChart from './BaseChart';
import { formatSI } from 'utils/format';
import { renderLegend, renderTooltip } from 'utils/chart-rendering';

class Summary extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }

    const {
      colors,
      data,
      domain,
      margin,
      scenarios,
      unit,
      yTicks
    } = this.props;

    const findScenario = (slug) => (scenarios.find((s) => slug.toString() === s.slug) || {});
    const colorForScenario = (slug) => findScenario(slug).color;
    const tickFormat = (slug) => findScenario(slug).name;
    const lineOrder = ['min', 'mean', 'max'];
    const lineColor = {
      min: colors[0],
      mean: colors[1],
      max: colors[2]
    };
    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const paddingScale = scaleLinear()
          .domain([400, 900])
          .range([0.25, 1])
          .clamp(true);

    const scale = {
      x: scalePoint()
        .domain(domain.x)
        .range([0, width])
        .padding(paddingScale(width)),
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
        .tickFormat((d) => formatSI(d, 3))
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(10)
    };

    const chart = select(this.chart);

    this.performCleanUp(chart);

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

    const groupedByScenario = groupBy(data, (v) => v.swl);
    const hoverData = Object.keys(groupedByScenario).map((swl) => ({
      swl,
      values: groupedByScenario[swl]
    }));
    const renderLineHtml = (v) => (`
      <p>
        <b><span class="small-circle" style="background: ${lineColor[v.line]};"></span>&nbsp;${v.line}: </b>
        ${formatSI(v.value, 2)}${unit === '%' ? '' : ' '}${unit}
      </p>
    `);
    const orderByLineDesc = (array) => [...array].sort((a, b) => lineOrder.indexOf(a.line) < lineOrder.indexOf(b.line));
    const hoverBoxWidth = Math.min(150, (width / 3) - 20);
    renderTooltip({
      appendTo: svg,
      chart,
      data: hoverData,
      width: hoverBoxWidth,
      height,
      getHoverColor: (d) => colorForScenario(d.swl),
      getPositionX: (d) => scale.x(d.swl),
      getTooltipHtml: (d) => orderByLineDesc(d.values).map(renderLineHtml).join('')
    });

    renderLegend({
      appendTo: svg,
      width,
      height: 20,
      position: { x: 0, y: height + 50 },
      series: Object.keys(lines).map((l) => ({ label: l, color: lineColor[l] }))
    });
  }
}

Summary.propTypes = {
  ...BaseChart.propTypes,
  chart: PropTypes.string.isRequired,
  colors: PropTypes.array.isRequired,
  iso: PropTypes.string.isRequired,
  scenarios: PropTypes.array.isRequired,
  unit: PropTypes.string.isRequired,
  yTicks: PropTypes.number
};

Summary.defaultProps = {
  ...BaseChart.defaultProps,
  margin: {
    left: 40,
    right: 30,
    top: 30,
    bottom: 60
  },
  scenarios: [],
  yTicks: 5
};

export default Summary;
