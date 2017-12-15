import { connect } from 'react-redux';

import RegularBar from 'components/charts/RegularBar';
import { scenarioColors } from 'constants/country';

const mapStateToProps = ({ charts, config }, { chart, iso }) => {
  if (!charts[chart]) {
    return {};
  }

  return {
    remote: charts[chart][iso],
    scenarios: config.scenarios.map((scenario, idx) => ({
      slug: scenario.slug,
      label: scenario.name,
      color: scenarioColors[idx]
    }))
  };
};

export default connect(mapStateToProps)(RegularBar);
