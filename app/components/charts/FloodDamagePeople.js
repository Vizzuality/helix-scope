import React from 'react';
import RegularBarChart from 'components/common/charts/RegularBar';

const FloodDamagePeople = function FloodDamagePeople(props) {
  const sql = `
    SELECT mean / 10e6 as value, swl_info as swl, variable, institution, model_short_name
    FROM master_admin0
    WHERE variable = 'river_floods_ExpDam'
    AND iso = '${props.iso}'
    AND swl_info < 6
  `;

  const colors = ['#a4c504', '#c4bb00', '#ff9000'];
  const scenarios = props.scenarios.map((scenario, idx) => ({
    slug: scenario.slug,
    label: scenario.name,
    color: colors[idx]
  }), {});

  return (
    <RegularBarChart
      title="Annual expected flood damages relative to 1976–2005 levels"
      sql={sql}
      scenarios={scenarios}
    />
  );
};

FloodDamagePeople.propTypes = {
  iso: React.PropTypes.string.isRequired,
  countryName: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array.isRequired
};

export default FloodDamagePeople;
