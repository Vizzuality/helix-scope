import React, { Component } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
// import { fetchChart } from 'actions/charts';

function withFetching(ChartComponent) {
  class WithFetching extends Component {
    componentDidMount() {
      this.reloadDataIfNeeded(this.props);
    }

    componentWillReceiveProps(props) {
      this.reloadDataIfNeeded(props);
    }

    reloadDataIfNeeded(props) {
      const {
        chart,
        charts,
        iso,
        fetchData
      } = props;

      const chartData = get(charts, `[${chart}][${iso}]`);

      if (!chartData) fetchData();
    }

    render() {
      return <ChartComponent {...this.props} />;
    }
  }

  WithFetching.propTypes = {
    chart: React.PropTypes.string.isRequired,
    charts: React.PropTypes.any,
    iso: React.PropTypes.string.isRequired,
    fetchData: React.PropTypes.func.isRequired
  };

  const mapStateToProps = ({ charts }) => ({
    charts
  });

  return connect(mapStateToProps)(WithFetching);
}

export default withFetching;
