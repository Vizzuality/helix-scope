import React, { Component } from 'react';
import d3 from 'd3';
import cartoQuery from 'utils/cartoQuery';

class YieldChange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    };
  }

  componentDidMount() {
    const sql = `
      SELECT swl, variable,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
        PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) - PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value)  AS iqr,
        ARRAY_AGG(value ORDER BY value ASC) AS values
      FROM (
        SELECT mean as value, swl_info as swl, variable
        FROM master_admin0
        WHERE variable like '%yield%'
        AND iso = '${this.props.iso}'
        AND swl_info < 6
      ) data
      GROUP BY swl, variable
    `;

    cartoQuery(sql)
      .then((response) => response.json())
      .then((data) => data.rows)
      .then((data) => {
        this.setState({
          loading: false,
          data
        });
      });
  }

  componentDidUpdate() {
    this.drawChart();
  }

  drawChart() {
    window.data = this.state.data;
    const margin = {
      left: 32,
      right: 63,
      top: 10,
      bottom: 10
    };
    const width = this.chart.offsetWidth - (margin.left + margin.right);
    const height = this.chart.offsetHeight - (margin.top + margin.bottom);
    const uniq = (d, idx, arr) => arr.indexOf(d) === idx;
    const scale = {
      x: d3.scale.ordinal()
        .domain(this.state.data.map((d) => d.swl).filter(uniq))
        .rangePoints([0, width]),
      y: d3.scale.linear()
        .domain(d3.extent(this.state.data, (d) => d.median))
        .range([height, 0])
    };

    const axes = {
      x: d3.svg.axis()
        .scale(scale.x)
        .orient('bottom'),
      y: d3.svg.axis()
        .scale(scale.y)
        .orient('left')
    };

    const svg = d3.select(this.chart)
      .append('svg')
      .attr('width', width + (margin.left + margin.right))
      .attr('height', height + (margin.top + margin.bottom));

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
      .attr('r', 3.5)
      .attr('cx', (d) => scale.x(d.swl))
      .attr('cy', (d) => scale.y(d.median));
  }

  render() {
    return (
      <div className="c-chart">
        <div className="title">Average monthly maxiumum temperature</div>
        {!this.state.loading ?
          (<div className="chart" ref={(ref) => { this.chart = ref; }}></div>) :
          (<div className="content subtitle">Loading</div>)}
      </div>
    );
  }
}

YieldChange.propTypes = {
  iso: React.PropTypes.string
};

export default YieldChange;
