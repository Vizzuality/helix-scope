import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

import LoadingChart from './LoadingChart';

class BaseChart extends Component {
  constructor() {
    super();
    this.onPageResize = this.onPageResize.bind(this);
  }

  componentDidMount() {
    this.drawChart();
    window.addEventListener('resize', this.onPageResize);
  }

  componentDidUpdate() {
    this.drawChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onPageResize);
  }

  onPageResize() {
    debounce(this.drawChart.bind(this), 200)();
  }

  drawChart() {}

  render() {
    const isLoading = this.props.loading;
    const noData = !isLoading && get(this.props, 'data.length', 0) === 0;

    if (isLoading) return <LoadingChart />;

    return (
      <div className="c-chart">
        {noData ? (
          <div className="content subtitle">No data available</div>
        ) : (
          <div className="chart" ref={(ref) => { this.chart = ref; }}></div>
        )}
      </div>
    );
  }
}

BaseChart.defaultProps = {
  margin: {
    left: 40,
    right: 30,
    top: 30,
    bottom: 30
  },
  loading: true,
  data: []
};

BaseChart.propTypes = {
  margin: React.PropTypes.shape({
    left: React.PropTypes.number,
    right: React.PropTypes.number,
    top: React.PropTypes.number,
    bottom: React.PropTypes.number
  }),
  loading: React.PropTypes.bool.isRequired,
  data: React.PropTypes.array.isRequired
};

export default BaseChart;
