import React, { Component } from 'react';
import d3 from 'd3';
import cartoQuery from 'utils/cartoQuery';
import debounce from 'debounce';

class InterQuartileRange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    };
  }

  componentDidMount() {
    cartoQuery(this.props.sql)
      .then((response) => response.json())
      .then((data) => data.rows)
      .then((data) => {
        this.setState({
          loading: false,
          data
        });
      });

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
    const colorFor = (variable) => (this.props.variables.find((v) => v.variable === variable) || { color: 'black' }).color;
    const uniq = (d, idx, arr) => arr.indexOf(d) === idx;
    const tickFormat = (val) => this.props.xLabels[val] || val;

    const margin = {
      left: 30,
      right: 30,
      top: 30,
      bottom: 60
    };

    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);

    const domain = {
      x: this.state.data.map((d) => d.swl).filter(uniq),
      y: d3.extent(this.state.data, (d) => d.median)
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
        .orient('bottom'),
      y: d3.svg.axis()
        .scale(scale.y)
        .orient('left')
        .ticks(this.props.yTicks)
        .innerTickSize(-width)
    };

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
      .data(this.state.data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', (d) => colorFor(d.variable))
      .attr('cx', (d) => scale.x(d.swl))
      .attr('cy', (d) => scale.y(d.median));

    svg.selectAll('.dot')
      .data(this.state.data)
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
      .attr('cy', (d) => height + 50)
      .attr('fill', (d) => d.color);

    legend.selectAll('text')
      .data(this.props.variables)
      .enter()
      .append('text')
      .attr('x', (d, i) => (i * 60) + 8)
      .attr('y', (d) => height + 55)
      .text((d) => d.label);
  }

  render() {
    return (
      <div className="c-chart">
        <div className="title">{this.props.title}</div>
        {!this.state.loading ?
          (<div className="chart" ref={(ref) => { this.chart = ref; }}></div>) :
          (<div className="content subtitle">Loading</div>)}
      </div>
    );
  }
}

InterQuartileRange.propTypes = {
  title: React.PropTypes.string.isRequired,
  sql: React.PropTypes.string.isRequired,
  variables: React.PropTypes.array,
  xLabels: React.PropTypes.object,
  yTicks: React.PropTypes.number
};

InterQuartileRange.defaultProps = {
  meta: {},
  variables: {},
  xLabels: {},
  yTicks: 5
};

export default InterQuartileRange;
