import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';

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
        data,
        loading,
        fetchData
      } = props;

      if (!data && !loading) fetchData();
    }

    render() {
      return <ChartComponent {...this.props} />;
    }
  }

  WithFetching.propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
    fetchData: PropTypes.func.isRequired
  };

  const mapStateToProps = ({ charts, config }, { chart, iso, measure }) => {
    const chartId = measure ? `${chart}_${measure}` : chart;
    const chartData = get(charts, `[${chartId}][${iso}]`);

    if (!chartData) return {};

    return {
      loading: chartData.loading,
      data: chartData.data
    };
  };

  return connect(mapStateToProps)(WithFetching);
}

export default withFetching;
