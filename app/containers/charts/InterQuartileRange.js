import { connect } from 'react-redux';

import InterQuartileRange from 'components/charts/InterQuartileRange';

const mapStateToProps = ({ charts, config }, { chart, iso }) => {
  if (!charts[chart]) {
    return {};
  }

  return {
    remote: charts[chart][iso],
    scenarios: config.scenarios
  };
};

export default connect(mapStateToProps)(InterQuartileRange);
