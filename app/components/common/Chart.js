import React from 'react';
import d3 from 'd3';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.drawChart(this.getParsedData(this.props.data.data));
  }

  getBucketsColor(category) {
    switch (category) {
      case 'biodiversity':
        return ['#DDE133', '#E5CF19', '#A4C504', '#268434'];
      case 'water':
        return ['#B3ECDD', '#5FAACF', '#4963B8', '#383E9C'];
      case 'climate':
        return ['#FDEB58', '#F5C217', '#EA9315', '#E04B12'];
      default:
        return [];
    }
  }

  getParsedData(data) {
    if (!data) return null;

    const values = [];
    for (let i = 0, dataLength = data.length; i < dataLength; i++) {
      const indicators = Object.keys(data[i]).filter((elem) => elem !== 'season');
      for (let j = 0, iLength = indicators.length; j < iLength; j++) {
        values.push({
          symbol: indicators[j],
          value: data[i][indicators[j]],
          season: data[i].season
        });
      }
    }
    return values;
  }

  drawChart(data) {
    let width = this.chart.offsetWidth;
    let height = this.chart.offsetHeight;
    const interpolate = 'linear';
    const unit = this.props.data.unit;
    const bucket = this.getBucketsColor(this.props.data.category);
    const margin = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    };

    const parseSeason = (season) => {
      switch (season) {
        case 1:
          return 'Mar/Apr/May';
        case 2:
          return 'Jun/Jul/Aug';
        case 3:
          return 'Sep/Oct/Nov';
        case 4:
          return 'Dec/Jan/Feb';
        default:
          return '';
      }
    };

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const x = d3.scale.linear().range([0, width]);
    const y = d3.scale.linear().range([height, 0]);

    const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(4)
        .outerTickSize(1)
        .tickFormat((d) => parseSeason(d));

    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(5)
        .innerTickSize(-width)
        .outerTickSize(1)
        .tickPadding(4);

    const line = d3.svg.line()
        .x((d) => x(d.season))
        .y((d) => y(d.value))
        .defined((d) => d.value)
        .interpolate(interpolate);

    const svg = d3.select(this.chart).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);


    x.domain(d3.extent(data, (d) => d.season));
    y.domain([0, d3.max(data, (d) => d.value)]);

    // Nest the entries by symbol
    const dataNest = d3.nest()
      .key((d) => d.symbol)
      .entries(data);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // Loop through each symbol / key
    dataNest.forEach((d, i) => {
      svg.append('path')
        .attr('class', 'multiline')
        .attr('d', line(d.values))
        .attr('stroke', () => bucket[i]);
    });

    svg.append('g')
      .attr('transform', 'translate(-5, -10)').append('text')
      .attr('class', 'unit')
      .attr('x', () => 0)
      .attr('y', '-10')
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .text(() => unit);
  }

  render() {
    return (
      <div className="c-chart">
        <div className="subtitle">{this.props.data.category}</div>
        <div className="title">{this.props.data.name}</div>
        <div className="chart" ref={ref => (this.chart = ref)}></div>
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.object.isRequired
};

export default Chart;
