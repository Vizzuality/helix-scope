import React from 'react';
import PropTypes from 'prop-types';
import { axisBottom } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { quantile } from 'd3-array';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import BaseChart from './BaseChart';
import { formatSI } from 'utils/format';
import { modelColors } from 'constants/colors';
import { renderLegend } from 'utils/chart-rendering';

class MapPopupPlot extends BaseChart {
  drawChart() {
    if (!this.chart) {
      return;
    }

    const {
      margin,
      data,
      unit
    } = this.props;

    const getBoxQuartiles = (d) => ([
      quantile(d, 0.25),
      quantile(d, 0.5),
      quantile(d, 0.75)
    ]);
    const values = data.map((d) => d.value).sort((a, b) => a - b);
    const quartiles = getBoxQuartiles(values);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const models = uniqBy(flatMap(data, (d) => d.model_short_name));
    const colorFor = (model) => modelColors[models.indexOf(model)];
    const showLastWithUnit = (d, idx, arr) => (
      idx === (arr.length - 1) ? `${formatSI(d, 2)} ${unit}` : formatSI(d, 2)
    );
    const tickCount = Math.max(4, data.length / 2);

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const domain = {
      x: [minValue, maxValue]
    };

    const scale = {
      x: scaleLinear()
        .range([0, width])
        .domain(domain.x)
        .nice()
    };

    const axes = {
      x: axisBottom()
        .scale(scale.x)
        .ticks(tickCount)
        .tickFormat(showLastWithUnit)
        .tickSizeOuter(0)
        .tickSizeInner(10)
    };
    const y = height - 20;

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

    const bar = svg.append('g');
    const barColor = '#515253';

    // main range line
    bar.append('line')
      .attr('stroke', barColor)
      .attr('stroke-width', 1)
      .attr('x1', scale.x(minValue))
      .attr('y1', y)
      .attr('x2', scale.x(maxValue))
      .attr('y2', y);

    // quartiles box
    const qboxHeight = 30;
    const qboxWidth = scale.x(quartiles[2]) - scale.x(quartiles[0]);

    bar.append('rect')
      .attr('stroke-width', 0)
      .attr('fill', barColor)
      .attr('opacity', 0.3)
      .attr('x', scale.x(quartiles[0]))
      .attr('y', y - (qboxHeight / 2))
      .attr('width', qboxWidth)
      .attr('height', qboxHeight);

    // median
    bar.append('line')
      .attr('stroke', barColor)
      .attr('stroke-width', 1)
      .attr('x1', scale.x(quartiles[1]))
      .attr('y1', y - (qboxHeight / 2))
      .attr('x2', scale.x(quartiles[1]))
      .attr('y2', y + (qboxHeight / 2));

    // left whisker
    const whiskerWidth = 20;
    bar.append('line')
      .attr('stroke', barColor)
      .attr('stroke-width', 1)
      .attr('x1', scale.x(minValue))
      .attr('y1', y - (whiskerWidth / 2))
      .attr('x2', scale.x(minValue))
      .attr('y2', y + (whiskerWidth / 2));

    // right whisker
    bar.append('line')
      .attr('stroke', barColor)
      .attr('stroke-width', 1)
      .attr('x1', scale.x(maxValue))
      .attr('y1', y - (whiskerWidth / 2))
      .attr('x2', scale.x(maxValue))
      .attr('y2', y + (whiskerWidth / 2));

    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', (d) => colorFor(d.model_short_name))
      .attr('cx', (d) => scale.x(d.value))
      .attr('cy', y);

    renderLegend({
      appendTo: svg,
      width,
      height: 20,
      position: { x: 0, y: height + 50 },
      series: models.map((m) => ({ label: m, color: colorFor(m) }))
    });
  }

  render() {
    return (
      <div className="c-chart map-popup-chart">
        <div className="chart" ref={(ref) => { this.chart = ref; }}></div>
      </div>
    );
  }
}

MapPopupPlot.propTypes = {
  ...BaseChart.propTypes,
  unit: PropTypes.string.isRequired
};

MapPopupPlot.defaultProps = {
  ...BaseChart.defaultProps,
  margin: {
    left: 20,
    right: 20,
    top: 20,
    bottom: 60
  }
};

export default MapPopupPlot;
