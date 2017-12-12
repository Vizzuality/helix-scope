import React from 'react';
import ErrorBarChart from 'components/common/charts/ErrorBar';

const CountryWideAverageMonthlyMaxTemperature = function CountryWideAverageMonthlyMaxTemperature(props) {
  const biodiversityVariables = [
    'amphibianobiodiversity',
    'amphibiarealbiodiversity',
    'birdnobiodiversity',
    'birdrealbiodiversity',
    'mammalnobiodiversity',
    'mammalrealbiodiversity',
    'reptilenobiodiversity',
    'reptilerealbiodiversity'
  ];

  const valueFactor = biodiversityVariables.indexOf(props.variable) > -1 ? 100 : 1;

  const sql = `
    SELECT swl, variable,
      PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value) AS q1,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) AS q3,
      MAX(value) AS maximum,
      MIN(value) AS minimum,
      ARRAY_AGG(value ORDER BY value ASC) AS values
    FROM (
      SELECT model_short_name, swl_info AS swl, run, model_long_name, institution,
        ${props.value} / ${valueFactor} as value, variable
      FROM master_admin0
      WHERE variable = '${props.variable}'
      AND iso = '${props.iso}'
      AND swl_info < 6
      ORDER BY swl
    ) data
    GROUP BY swl, variable
  `;

  const colors = ['#a4c504', '#c4bb00', '#ff9000'];
  const scenarios = props.scenarios.map((scenario, idx) => ({
    slug: scenario.slug,
    label: scenario.name,
    color: colors[idx]
  }), {});

  return (
    <ErrorBarChart
      title="Standard Deviation of average monthly maximum temperature"
      sql={sql}
      scenarios={scenarios}
      infoText="placeholder text"
    />
  );
};

CountryWideAverageMonthlyMaxTemperature.propTypes = {
  value: React.PropTypes.string,
  variable: React.PropTypes.string,
  iso: React.PropTypes.string.isRequired,
  countryName: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array.isRequired
};

CountryWideAverageMonthlyMaxTemperature.defaultProps = {
  value: 'std',
  variable: 'tx'
};

export default CountryWideAverageMonthlyMaxTemperature;

