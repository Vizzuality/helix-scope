import React, { Component } from 'react';
import debounce from 'lodash/debounce';

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
}

BaseChart.defaultProps = {
  margin: {
    left: 30,
    right: 30,
    top: 30,
    bottom: 30
  }
};

BaseChart.propTypes = {
  margin: React.PropTypes.shape({
    left: React.PropTypes.number,
    right: React.PropTypes.number,
    top: React.PropTypes.number,
    bottom: React.PropTypes.number
  })
};

export default BaseChart;
