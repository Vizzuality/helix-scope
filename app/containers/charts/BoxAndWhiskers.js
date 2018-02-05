import { connect } from 'react-redux';

import BoxAndWhiskers from 'components/charts/BoxAndWhiskers';
import { scenarioColors } from 'constants/country';

const mapStateToProps = ({ charts, config }, { chart, iso, variable, value }) => {
  if (!charts[chart] || !iso) {
    return {};
  }

  return {
    remote: {
      ...charts[chart][iso],
      data: charts[chart][iso].data
        .filter((d) => d.variable === variable)
        .map((d) => ({
          swl: d.swl,
          variable: d.variable,
          models: d.models,
          institutions: d.institutions,
          minimum: d[`${value}_minimum`],
          maximum: d[`${value}_maximum`],
          median: d[`${value}_median`],
          q1: d[`${value}_q1`],
          q3: d[`${value}_q3`]
        }))
    },
    scenarios: config.scenarios.map((scenario, idx) => ({
      slug: scenario.slug,
      label: scenario.short_name,
      color: scenarioColors[idx]
    }))
  };
};

export default connect(mapStateToProps)(BoxAndWhiskers);
