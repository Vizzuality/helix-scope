import React, { Component } from 'react';

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
    data: React.PropTypes.array,
    loading: React.PropTypes.bool,
    fetchData: React.PropTypes.func.isRequired
  };

  return WithFetching;
}

export default withFetching;
