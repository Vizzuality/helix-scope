import { connect } from 'react-redux';

import RegularBar from 'components/charts/RegularBar';
import { scenarioColors } from 'constants/country';
import withFetching from 'components/charts/withFetching';
import { fetchRegularBar } from 'actions/charts';

const mapStateToProps = ({ config }) => ({
  scenarios: config.scenarios.map((scenario, idx) => ({
    slug: scenario.slug,
    label: scenario.name,
    color: scenarioColors[idx]
  }))
});

const mapDispatchToProps = (dispatch, { chart, iso, variable }) => ({
  fetchData: () => {
    dispatch(fetchRegularBar(chart, iso, variable));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withFetching(RegularBar));
