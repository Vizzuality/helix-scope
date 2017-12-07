import React from 'react';
import InterQuartileRangeChart from 'components/common/charts/InterQuartileRange';

const CropYieldChange = function CropYieldChange(props) {
  const sql = `
    SELECT swl, variable,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) - PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value)AS iqr,
      ARRAY_AGG(value ORDER BY value ASC) AS values
    FROM (
      SELECT mean as value, swl_info as swl, variable
      FROM master_admin0
      WHERE variable like '%yield%'
      AND iso = '${props.iso}'
      AND swl_info < 6
    ) data
    GROUP BY swl, variable
  `;

  /* eslint-disable quote-props */
  const colors = {
    'Maize_yield_perc_change': '#5faacf',
    'Rice_yield_perc_change': '#c75fcf',
    'Wheat_yield_perc_change': '#5fcfa6',
    'Soybeans_yield_perc_change': '#6d5fcf'
  };
  /* eslint-enable quote-props */

  const xLabels = props.scenarios.reduce((acc, current) => {
    acc[current.slug] = current.name; // eslint-disable-line no-param-reassign
    return acc;
  }, {});

  return (
    <InterQuartileRangeChart
      title={`Projected changes in crop yields relative to 1981–2010 base-level for ${props.countryName}`}
      sql={sql}
      colors={colors}
      xLabels={xLabels}
    />
  );
};

CropYieldChange.propTypes = {
  iso: React.PropTypes.string.isRequired,
  countryName: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array.isRequired
};

export default CropYieldChange;
