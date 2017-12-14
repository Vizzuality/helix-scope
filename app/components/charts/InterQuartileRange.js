import React, { Component } from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';
import debounce from 'debounce';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import InfoButton from './InfoButton';

class InterQuartileRange extends Component {

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

    const uniq = (d, idx, arr) => arr.indexOf(d) === idx;
    const colorFor = (variable) => (this.props.variables.find((v) => v.variable === variable) || { color: 'black' }).color;
    const findScenario = (slug) => (this.props.scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (val) => (findScenario(val).name);

    const margin = {
      left: 30,
      right: 30,
      top: 30,
      bottom: 60
    };

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);

    const domain = {
      x: this.props.remote.data.map((d) => d.swl).filter(uniq),
      y: d3.extent(this.props.remote.data, (d) => d.median)
    };

    const scale = {
      x: d3.scale.ordinal()
        .domain(domain.x)
        .rangePoints([0, width], 1),
      y: d3.scale.linear()
        .domain(domain.y)
        .nice()
        .range([height, 0])
    };

    const axes = {
      x: d3.svg.axis()
        .scale(scale.x)
        .tickFormat(tickFormat)
        .outerTickSize(0)
        .orient('bottom'),
      y: d3.svg.axis()
        .scale(scale.y)
        .orient('left')
        .ticks(this.props.yTicks)
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10)
    };

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
      .data(this.props.remote.data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', (d) => colorFor(d.variable))
      .attr('cx', (d) => scale.x(d.swl))
      .attr('cy', (d) => scale.y(d.median));

    svg.selectAll('.dot')
      .data(this.props.remote.data)
      .enter()
      .append('line')
      .attr('stroke', (d) => colorFor(d.variable))
      .attr('stroke-width', 2)
      .attr('x1', (d) => scale.x(d.swl))
      .attr('y1', (d) => scale.y(d.median - d.iqr))
      .attr('x2', (d) => scale.x(d.swl))
      .attr('y2', (d) => scale.y(d.median + d.iqr));

    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('width', width)
      .attr('height', 20)
      .attr('transform', 'translate(0, 0)');

    legend.selectAll('circle')
      .data(this.props.variables)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', (d, i) => i * 60)
      .attr('cy', height + 50)
      .attr('fill', (d) => d.color);

    legend.selectAll('text')
      .data(this.props.variables)
      .enter()
      .append('text')
      .attr('x', (d, i) => (i * 60) + 8)
      .attr('y', height + 55)
      .text((d) => d.label);
  }

  render() {
    const models = uniqBy(flatMap(this.props.remote.data, (d) => d.models)).join(', ');
    const institutions = uniqBy(flatMap(this.props.remote.data, (d) => d.institutions)).join(', ');
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

InterQuartileRange.propTypes = {
  iso: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  info: React.PropTypes.func.isRequired,
  variables: React.PropTypes.array,
  scenarios: React.PropTypes.array,
  yTicks: React.PropTypes.number,
  chart: React.PropTypes.string.isRequired,
  remote: React.PropTypes.shape({
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array.isRequired
  }).isRequired
};

InterQuartileRange.defaultProps = {
  meta: {},
  variables: [],
  scenarios: [],
  yTicks: 5,
  remote: { loading: true, data: [] }
};

export default connect(({ charts, config }, { chart, iso }) => {
  if (!charts[chart]) {
    return {};
  }

  return {
    remote: charts[chart][iso],
    scenarios: config.scenarios
  };
})(InterQuartileRange);
