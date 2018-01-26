import React, { Component } from 'react';
import * as d3 from 'd3';
import debounce from 'debounce';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';
import { modelColors } from 'constants/colors';

class MapPopupPlot extends Component {
  componentDidMount() {
    this.drawChart();
    window.addEventListener('resize', this.onPageResize.bind(this));
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onPageResize.bind(this));
  }

  onPageResize() {
    debounce(this.drawChart.bind(this), 200)();
  }

  drawChart() {
    if (!this.chart) {
      return;
    }

    const getBoxQuartiles = (data) => ([
      d3.quantile(data, 0.25),
      d3.quantile(data, 0.5),
      d3.quantile(data, 0.75)
    ]);
    const values = this.props.data.map((d) => d.value).sort();
    const quartiles = getBoxQuartiles(values);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const models = uniqBy(flatMap(this.props.data, (d) => d.model_short_name));
    const colorFor = (model) => modelColors[models.indexOf(model)];

    const margin = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 60
    };

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const domain = {
      x: [minValue, maxValue]
    };

    const scale = {
      x: d3.scaleLinear()
        .domain(domain.x)
        .range([0, width])
    };

    const axes = {
      x: d3.axisBottom()
        .scale(scale.x)
        .ticks(4)
        .tickSizeOuter(10)
        .tickSizeInner(10)
    };
    const y = height - 30;

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

    // // main range line
    bar.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', scale.x(minValue))
      .attr('y1', y)
      .attr('x2', scale.x(maxValue))
      .attr('y2', y);

    // quartiles box
    const qboxHeight = 30;
    bar.append('rect')
      .attr('stroke-width', 0)
      .attr('fill', '#515253')
      .attr('opacity', 0.3)
      .attr('x', scale.x(quartiles[0]))
      .attr('y', y - (qboxHeight / 2))
      .attr('width', scale.x(quartiles[2]) - scale.x(quartiles[0]))
      .attr('height', qboxHeight);

    // median
    bar.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', scale.x(quartiles[1]))
      .attr('y1', y - (qboxHeight / 2))
      .attr('x2', scale.x(quartiles[1]))
      .attr('y2', y + (qboxHeight / 2));

    // left whisker
    const whiskerWidth = 20;
    bar.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', scale.x(minValue))
      .attr('y1', y - (whiskerWidth / 2))
      .attr('x2', scale.x(minValue))
      .attr('y2', y + (whiskerWidth / 2));

    // right whisker
    bar.append('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', scale.x(maxValue))
      .attr('y1', y - (whiskerWidth / 2))
      .attr('x2', scale.x(maxValue))
      .attr('y2', y + (whiskerWidth / 2));

    svg.selectAll('.dot')
      .data(this.props.data)
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
  data: React.PropTypes.array.isRequired
};

MapPopupPlot.defaultProps = {
};

export default MapPopupPlot;
