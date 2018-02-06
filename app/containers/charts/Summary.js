import { connect } from 'react-redux';
import get from 'lodash/get';

import Summary from 'components/charts/Summary';
import { scenarioColors } from 'constants/country';
import withFetching from 'components/charts/withFetching';
import {
  fetchSummary,
  fetchTemperatureSummary
} from 'actions/charts';

const mapStateToProps = ({ charts, config }, { chart, iso }) => {
  if (!charts[chart]) {
    return {};
  }

  return {
    loading: get(charts, `[${chart}][${iso}].loading`),
    data: get(charts, `[${chart}][${iso}].data`),
    scenarios: config.scenarios.map((scenario, idx) => ({
      slug: scenario.slug,
      label: scenario.name,
      color: scenarioColors[idx]
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
