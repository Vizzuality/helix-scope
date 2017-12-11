import React from 'react';
import InterQuartileRangeChart from 'components/common/charts/InterQuartileRange';

const CropYieldChangeIrrigation = function CropYieldChangeIrrigation(props) {
  const sql = `
    SELECT swl, variable,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) - PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value) AS iqr,
      ARRAY_AGG(value ORDER BY value ASC) AS values
    FROM (
      SELECT mean as value, swl_info as swl, variable
      FROM master_admin0
      WHERE variable like '%Irrigation%'
      AND iso = '${props.iso}'
      AND swl_info < 6
    ) data
    GROUP BY swl, variable
  `;

  /* eslint-disable quote-props */
  const variables = [
    {
      variable: 'Maize_Irrigation_avoided_perc_change',
      color: '#5faacf',
      label: 'Maize'
    },
    {
      variable: 'Rice_Irrigation_avoided_perc_change',
      color: '#c75fcf',
      label: 'Rice'
    },
    {
      variable: 'Wheat_Irrigation_avoided_perc_change',
      color: '#5fcfa6',
      label: 'Wheat'
    },
    {
      variable: 'Soybeans_Irrigation_avoided_perc_change',
      color: '#6d5fcf',
      label: 'Soybeans'
    }
  ];
  /* eslint-enable quote-props */

  const xLabels = props.scenarios.reduce((acc, current) => {
    acc[current.slug] = current.name; // eslint-disable-line no-param-reassign
    return acc;
  }, {});

  return (
    <InterQuartileRangeChart
      title={`Change in crop yields (relative to 1981-2010 base levels) avoided under different warming scenarios due to Irrigation for ${props.countryName}`}
      sql={sql}
      variables={variables}
      xLabels={xLabels}
    />
  );
};

CropYieldChangeIrrigation.propTypes = {
  iso: React.PropTypes.string.isRequired,
  countryName: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array.isRequired
};

export default CropYieldChangeIrrigation;
