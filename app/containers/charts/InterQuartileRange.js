import { connect } from 'react-redux';

import InterQuartileRange from 'components/charts/InterQuartileRange';
import withFetching from 'components/charts/withFetching';
import { fetchInterQuartileRange } from 'actions/charts';

const mapStateToProps = ({ config }) => ({
  scenarios: config.scenarios
});

const mapDispatchToProps = (dispatch, { chart, iso, variable }) => ({
  fetchData: () => {
    dispatch(fetchInterQuartileRange(chart, iso, variable));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withFetching(InterQuartileRange));
