import { connect } from 'react-redux';

import Summary from 'components/charts/Summary';
import withFetching from 'components/charts/withFetching';
import {
  fetchSummary,
  fetchTemperatureSummary
} from 'actions/charts';
import { scenarioColors } from 'constants/country';

const mapStateToProps = ({ config }) => ({
  scenarios: config.scenarios.map((scenario, idx) => ({
    slug: scenario.slug,
    name: scenario.name,
    color: scenarioColors[idx]
  }))
});

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
