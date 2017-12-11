import React from 'react';
import InterQuartileRangeChart from 'components/common/charts/InterQuartileRange';

const CropYieldChangeBaseline = function CropYieldChangeBaseline(props) {
  const sql = `
    SELECT swl, variable,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) - PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value) AS iqr,
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
  const variables = [
    {
      variable: 'Maize_yield_perc_change',
      color: '#5faacf',
      label: 'Maize'
    },
    {
      variable: 'Rice_yield_perc_change',
      color: '#c75fcf',
      label: 'Rice'
    },
    {
      variable: 'Wheat_yield_perc_change',
      color: '#5fcfa6',
      label: 'Wheat'
    },
    {
      variable: 'Soybeans_yield_perc_change',
      color: '#6d5fcf',
      label: 'Soybeans'
    }
  ];
  /* eslint-enable quote-props */


  return (
    <InterQuartileRangeChart
      title={`Projected changes in crop yields relative to 1981–2010 base-level for ${props.countryName}`}
      sql={sql}
      variables={variables}
      scenarios={props.scenarios}
    />
  );
};

CropYieldChangeBaseline.propTypes = {
  iso: React.PropTypes.string.isRequired,
  countryName: React.PropTypes.string.isRequired,
  scenarios: React.PropTypes.array.isRequired
};

export default CropYieldChangeBaseline;
