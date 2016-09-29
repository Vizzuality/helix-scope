import React from 'react';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="c-chart">
        <div className="subtitle">{this.props.data.category}</div>
        <div className="title">{this.props.data.name}</div>
        <div className="chart">
          Chart
        </div>
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.object.isRequired
};

export default Chart;
