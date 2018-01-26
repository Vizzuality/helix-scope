import React from 'react';
import * as d3 from 'd3';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';
import BaseChart from './BaseChart';
import { modelColors } from 'constants/colors';

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
      d3.quantile(d, 0.25),
      d3.quantile(d, 0.5),
      d3.quantile(d, 0.75)
    ]);
    const values = data.map((d) => d.value).sort();
    const quartiles = getBoxQuartiles(values);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const models = uniqBy(flatMap(data, (d) => d.model_short_name));
    const colorFor = (model) => modelColors[models.indexOf(model)];

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const domain = {
      x: [minValue, maxValue]
    };

    const scale = {
      x: d3.scaleLinear()
        .range([0, width])
        .domain(domain.x)
        .nice()
    };

    const axes = {
      x: d3.axisBottom()
        .scale(scale.x)
        .ticks(data.length / 2)
        .tickFormat((d, idx, arr) => (idx === (arr.length - 1) ? `${d} ${unit}` : d))
        .tickSizeOuter(0)
        .tickSizeInner(10)
    };
    const y = height - 20;

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
    bar.append('rect')
      .attr('stroke-width', 0)
      .attr('fill', barColor)
      .attr('opacity', 0.3)
      .attr('x', scale.x(quartiles[0]))
      .attr('y', y - (qboxHeight / 2))
      .attr('width', scale.x(quartiles[2]) - scale.x(quartiles[0]))
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

    const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('width', width)
          .attr('height', 20)
          .attr('transform', 'translate(0, 0)');

    legend.selectAll('circle')
      .data(models)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d, i) => i * 60)
      .attr('cy', height + 50)
      .attr('fill', (d) => colorFor(d));

    legend.selectAll('text')
      .data(models)
      .enter()
      .append('text')
      .attr('x', (d, i) => (i * 60) + 8)
      .attr('y', height + 55)
      .text((d) => d);
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
  data: React.PropTypes.array.isRequired,
  unit: React.PropTypes.string.isRequired
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
