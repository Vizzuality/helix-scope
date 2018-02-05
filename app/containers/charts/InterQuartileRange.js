import { connect } from 'react-redux';
import get from 'lodash/get';

import InterQuartileRange from 'components/charts/InterQuartileRange';

const mapStateToProps = ({ charts, config }, { chart, iso }) => {
  const chartData = get(charts, `[${chart}][${iso}]`);
  if (!chartData) return {};

  return {
    loading: chartData.loading,
    data: chartData.data,
    scenarios: config.scenarios
  };
};

export default connect(mapStateToProps)(InterQuartileRange);
