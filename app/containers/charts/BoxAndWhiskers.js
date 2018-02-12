import { connect } from 'react-redux';
import get from 'lodash/get';

import { fetchBoxAndWhiskers } from 'actions/charts';
import BoxAndWhiskers from 'components/charts/BoxAndWhiskers';
import { scenarioColors } from 'constants/country';
import withFetching from 'components/charts/withFetching';

const mapStateToProps = ({ charts, config }, { chart, iso, variable, value }) => {
  const chartId = `${chart}_${variable}_${value}`;
  const chartData = get(charts, `[${chartId}][${iso}]`);

  if (!chartData) return {};

  return {
    loading: chartData.loading,
    data: chartData.data,
    scenarios: config.scenarios.map((scenario, idx) => ({
      slug: scenario.slug,
      label: scenario.short_name,
      color: scenarioColors[idx]
    }))
  };
};

const mapDispatchToProps = (dispatch, { chart, iso, variable, value }) => ({
  fetchData: () => {
    dispatch(fetchBoxAndWhiskers(chart, iso, variable, value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withFetching(BoxAndWhiskers));
