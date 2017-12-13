import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import d3 from 'd3';
import debounce from 'debounce';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

import InfoButton from './InfoButton';
import { scenarioColors } from 'constants/country';

class RegularBar extends Component {

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
      y: d3.extent(this.props.remote.data, (d) => d.value)
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

    const barWidth = 50;

    const svg = d3.select(this.chart)
      .append('svg')
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
      .append('rect')
      .attr('fill', (d) => colorFor(d.swl))
      .attr('x', (d) => scale.x(d.swl) - (barWidth / 2))
      .attr('y', (d) => scale.y(d.value))
      .attr('width', barWidth)
      .attr('height', (d) => height - scale.y(d.value) - 1);
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

RegularBar.propTypes = {
  title: React.PropTypes.string.isRequired,
  info: React.PropTypes.func.isRequired,
  scenarios: React.PropTypes.array,
  yTicks: React.PropTypes.number,
  chart: React.PropTypes.string.isRequired,
  remote: React.PropTypes.shape({
    loading: React.PropTypes.bool.isRequired,
    data: React.PropTypes.array.isRequired
  }).isRequired
};

RegularBar.defaultProps = {
  meta: {},
  scenarios: [],
  yTicks: 5
};

export default compose(
  connect((state, props) => ({
    remote: state.charts[props.chart],
    scenarios: state.config.scenarios.map((scenario, idx) => ({
      slug: scenario.slug,
      label: scenario.name,
      color: scenarioColors[idx]
    }))
  }))
)(RegularBar);
