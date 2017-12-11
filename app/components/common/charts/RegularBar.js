import React, { Component } from 'react';
import InfoButton from 'components/common/charts/InfoButton';
import d3 from 'd3';
import cartoQuery from 'utils/cartoQuery';
import debounce from 'debounce';

class RegularBar extends Component {

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
      x: this.state.data.map((d) => d.swl).filter(uniq),
      y: d3.extent(this.state.data, (d) => d.value)
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
      .data(this.state.data)
      .enter()
      .append('rect')
      .attr('fill', (d) => colorFor(d.swl))
      .attr('x', (d) => scale.x(d.swl) - (barWidth / 2))
      .attr('y', (d) => scale.y(d.value))
      .attr('width', barWidth)
      .attr('height', (d) => height - scale.y(d.value) - 1);
  }

  render() {
    return (
      <div className="c-chart">
        <InfoButton text={this.props.infoText} />
        <div className="title">{this.props.title}</div>
        {!this.state.loading ?
          (<div className="chart" ref={(ref) => { this.chart = ref; }}></div>) :
          (<div className="content subtitle">Loading</div>)}
      </div>
    );
  }
}

RegularBar.propTypes = {
  title: React.PropTypes.string.isRequired,
  sql: React.PropTypes.string.isRequired,
  infoText: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array,
  yTicks: React.PropTypes.number
};

RegularBar.defaultProps = {
  meta: {},
  scenarios: [],
  yTicks: 5
};

export default RegularBar;
