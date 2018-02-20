import { connect } from 'react-redux';

import { fetchBoxAndWhiskers } from 'actions/charts';
import BoxAndWhiskers from 'components/charts/BoxAndWhiskers';
import { scenarioColors } from 'constants/country';
import withFetching from 'components/charts/withFetching';

const mapStateToProps = ({ config }) => ({
  scenarios: config.scenarios.map((scenario, idx) => ({
    slug: scenario.slug,
    name: scenario.name,
    color: scenarioColors[idx]
  }))
});

const mapDispatchToProps = (dispatch, { chart, iso, variable, measure }) => ({
  fetchData: () => {
    dispatch(fetchBoxAndWhiskers(chart, iso, variable, measure));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withFetching(BoxAndWhiskers));
