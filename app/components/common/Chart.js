import React from 'react';
import d3 from 'd3';
import { ENDPOINT_SQL } from 'constants/map';
import { getSeasonTextById } from 'constants/season';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noData: false
    };
    this.data = {};
    this.timer = null;
  }

  componentDidMount() {
    if (this.props.data.data && this.props.data.data.length) {
      this.onPageResize = () => {
        this.debounceDraw();
      };
      window.addEventListener('resize', this.onPageResize);

      this.data = this.getParsedData(this.props.data);
      this.drawChart();
    } else {
      this.setnoDataState(true);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onPageResize);
  }

  setnoDataState(state) {
    this.setState({
      noData: state
    });
  }

  getBucketsColor(category) {
    switch (category.toLowerCase()) {
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
    for (let i = 0, dataLength = data.data.length; i < dataLength; i++) {
      Object.keys(data.data[i].scenarios).forEach((key) => {
        values.push({
          scenario: key,
          value: data.data[i].scenarios[key].mean,
          season: data.data[i].season
        });
      });
    }

    values.sort((a, b) => {
      if (a.season < b.season) return -1;
      if (a.season > b.season) return 1;
      return 0;
    });

    return values;
  }

  debounceDraw() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.drawChart();
    }, 200);
  }

  drawChart() {
    let width = this.chart.offsetWidth;
    let height = this.chart.offsetHeight;
    const interpolate = 'linear';
    const numTicksY = 5;
    const unit = this.props.data.units;
    const bucket = this.getBucketsColor(this.props.data.category);
    const margin = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30
    };

    d3.selection.prototype.first = function () {
      return d3.select(this[0][0]);
    };

    d3.selection.prototype.last = function () {
      const last = this.size() - 1;
      return d3.select(this[0][last]);
    };

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    const x = d3.scale.linear().range([0, width]);
    const y = d3.scale.linear().range([height, 0]).nice();

    const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(4)
        .outerTickSize(1)
        .tickFormat((d) => getSeasonTextById(d));

    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(numTicksY)
        .innerTickSize(-width)
        .outerTickSize(1)
        .tickPadding(4);

    const yAxisValues = this.data
      .filter((elem) => (elem.season === 4))
      .map((elem) => elem.value);

    const yAxis2 = d3.svg.axis()
        .scale(y)
        .tickValues(yAxisValues)
        .orient('right')
        .tickFormat(d3.format(',.1f'));

    const line = d3.svg.line()
        .x((d) => x(d.season))
        .y((d) => y(d.value))
        .defined((d) => d.value)
        .interpolate(interpolate);

    const d3Chart = d3.select(this.chart);
    d3Chart.select('svg').remove();
    const svg = d3Chart.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);


    const domain = {
      x: d3.extent(this.data, (d) => d.season),
      y: [0, d3.max(this.data, (d) => d.value)]
    };

    x.domain(domain.x);
    y.domain(domain.y);

    // Add extra padding to Y domain
    y.domain([domain.y[0], d3.max(y.ticks(numTicksY)) + y.ticks(numTicksY)[1]]);

    // Nest the entries by scenario
    const dataNest = d3.nest()
      .key((d) => d.scenario)
      .entries(this.data);

    svg.append('g')
      .attr('class', 'y axis -no-line')
      .attr('transform', `translate(${width}, 0)`)
      .call(yAxis2);

    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    svg.selectAll('.axis.y .tick text').last()
      .append('tspan')
      .text(unit);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
        .attr('y', 15)
        .style('text-anchor', 'start');

    const xSvg = svg.select('.x.axis');
    const labelsSize = xSvg[0][0].getBBox().width;
    const axisSize = xSvg.select('.domain')[0][0].getBBox().width;
    const labelsText = xSvg.selectAll('text');
    const labelLength = labelsText[0].length;
    labelsText.attr('transform', (d, i) => (
      `translate(-${(labelsSize - axisSize + margin.right / 2) / labelLength * i}, 0)`
    ));

    // Loop through each scenario / key
    dataNest.forEach((d, i) => {
      svg.append('path')
        .attr('class', 'multiline')
        .attr('d', line(d.values))
        .attr('stroke', () => bucket[i]);
    });
  }

  render() {
    const downloadLink = `${ENDPOINT_SQL}?q=SELECT * FROM ${this.props.data.table_name} WHERE iso='${this.props.iso}'&format=csv`;
    return (
      <div className="c-chart">
        {!this.state.noData &&
          <a className="icon" href={downloadLink} target="_blank">
            <svg width="10" height="10" viewBox="0 0 16 16"><title>Download</title><path d="M12.307 16H3.693a1 1 0 0 1-.936-.649L0 8h16l-2.757 7.351a1 1 0 0 1-.936.649zM4 3l4 4 4-4h-2V0H6v3H4z" fillRule="evenodd" /></svg>
          </a>
        }
        <div className="subtitle">{this.props.data.category}</div>
        <div className="title">{this.props.data.indicator}</div>
        {this.state.noData
          ? <div className="content subtitle">There is no data for this selector</div>
          : <div className="chart" ref={ref => (this.chart = ref)}></div>
        }
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.object.isRequired,
  iso: React.PropTypes.string.isRequired
};

export default Chart;
