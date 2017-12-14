import React, { Component } from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';
import debounce from 'debounce';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import InfoButton from './InfoButton';
import { scenarioColors } from 'constants/country';

class BoxAndWhiskers extends Component {

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
    const findScenario = (slug) => (this.props.scenarios.find((s) => slug.toString() === s.slug) || {});
    const tickFormat = (slug) => findScenario(slug).label;
    const colorFor = (slug) => findScenario(slug).color;

    const margin = {
      left: 30,
      right: 30,
      top: 30,
      bottom: 30
    };

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const domain = {
      x: this.props.remote.data.map((d) => d.swl).filter(uniq),
      y: [
        Math.min.apply(null, this.props.remote.data.map((d) => d.minimum)),
        Math.max.apply(null, this.props.remote.data.map((d) => d.maximum))
      ]
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
      .data(this.props.remote.data)
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
  }

  render() {
    const titleText = this.props.title(
      this.props.indicatorName,
      this.props.measurementName
    );

    const models = uniqBy(flatMap(this.props.remote.data, (d) => d.models)).join(', ');
    const institutions = uniqBy(flatMap(this.props.remote.data, (d) => d.institutions)).join(', ');

    const infoText = this.props.info(
      this.props.indicatorName,
      this.props.measurementName,
      this.props.indicatorLongName,
      models,
      institutions
    );

    return (
      <div className="c-chart">
        <InfoButton text={infoText} />
        <div className="title">{titleText}</div>
        {!this.props.remote.loading ?
          (<div className="chart" ref={(ref) => { this.chart = ref; }}></div>) :
          (<div className="content subtitle">Loading</div>)}
      </div>
    );
  }
}

BoxAndWhiskers.propTypes = {
  iso: React.PropTypes.string.isRequired,
  title: React.PropTypes.func.isRequired,
  info: React.PropTypes.func.isRequired,
  scenarios: React.PropTypes.array,
  indicatorName: React.PropTypes.string,
  indicatorLongName: React.PropTypes.string,
  measurementName: React.PropTypes.string,
  yTicks: React.PropTypes.number,
  chart: React.PropTypes.string,
  variable: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  remote: React.PropTypes.shape({
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array.isRequired
  }).isRequired
};

BoxAndWhiskers.defaultProps = {
  meta: {},
  scenarios: [],
  yTicks: 5,
  remote: { loading: true, data: [] }
};

export default connect(({ charts, config }, { chart, iso, variable, value }) => {
  if (!charts[chart]) {
    return {};
  }

  return {
    remote: {
      ...charts[chart][iso],
      data: charts[chart][iso].data
        .filter((d) => d.variable === variable)
        .map((d) => ({
          swl: d.swl,
          variable: d.variable,
          models: d.models,
          institutions: d.institutions,
          minimum: d[`${value}_minimum`],
          maximum: d[`${value}_maximum`],
          median: d[`${value}_median`],
          q1: d[`${value}_q1`],
          q3: d[`${value}_q3`]
        }))
    },
    scenarios: config.scenarios.map((scenario, idx) => ({
      slug: scenario.slug,
      label: scenario.short_name,
      color: scenarioColors[idx]
    })),
    indicatorName: flatMap(config.categories, (c) => c.indicators)
      .find((i) => i.slug === variable)
      .name,
    indicatorLongName: flatMap(config.categories, (c) => c.indicators)
      .find((i) => i.slug === variable)
      .name_long,
    measurementName: config.measurements.find((i) => i.slug === value)
      .name
  };
})(BoxAndWhiskers);
