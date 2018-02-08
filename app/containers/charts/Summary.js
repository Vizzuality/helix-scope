import { connect } from 'react-redux';
import get from 'lodash/get';

import Summary from 'components/charts/Summary';
import withFetching from 'components/charts/withFetching';
import {
  fetchSummary,
  fetchTemperatureSummary
} from 'actions/charts';

const mapStateToProps = ({ charts, config }, { chart, iso }) => {
  const chartData = get(charts, `[${chart}][${iso}]`);

  if (!chartData) return {};

  return {
    loading: chartData.loading,
    data: chartData.data.map((d) => ({
      ...d,
      swl: config.scenarios.find((s) => s.slug === d.swl.toString()).short_name
    }))
  };
};

const mapDispatchToProps = (dispatch, { chart, iso, variable }) => ({
  fetchData: () => {
    if (chart === 'temperature_summary') {
      dispatch(fetchTemperatureSummary(chart, iso));
    } else {
      dispatch(fetchSummary(chart, iso, variable));
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withFetching(Summary));
