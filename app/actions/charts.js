import cartoQuery from 'utils/cartoQuery';

export const LOAD_CHART = 'LOAD_CHART';
export const RECEIVE_CHART = 'RECEIVE_CHART';

export function fetchInterQuartileRange(chart, iso, variable) {
  const sql = `
    SELECT swl, variable,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) - PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value) AS iqr,
      ARRAY_AGG(value ORDER BY value ASC) AS values,
      ARRAY_AGG(DISTINCT model_short_name) AS models,
      ARRAY_AGG(DISTINCT institution) AS institutions
    FROM (
      SELECT mean as value, swl_info as swl, variable, model_short_name, institution
      FROM master_admin0
      WHERE variable like '%${variable}%'
      AND iso = '${iso}'
      AND swl_info < 6
    ) data
    GROUP BY swl, variable
  `;

  return (dispatch) => {
    dispatch({
      type: LOAD_CHART,
      payload: {
        chart,
        iso
      }
    });

    return cartoQuery(sql)
      .then((response) => response.json())
      .then((response) => dispatch({
        type: RECEIVE_CHART,
        payload: {
          chart,
          iso,
          data: response.rows
        }
      }));
  };
}

export function fetchRegularBar(chart, iso, variable) {
  const sql = `
    SELECT mean / 10e6 as value, swl_info as swl, variable, institution, model_short_name AS model
    FROM master_admin0
    WHERE variable = '${variable}'
    AND iso = '${iso}'
    AND swl_info < 6
  `;

  return (dispatch) => {
    dispatch({
      type: LOAD_CHART,
      payload: {
        chart,
        iso
      }
    });

    return cartoQuery(sql)
      .then((response) => response.json())
      .then((response) => dispatch({
        type: RECEIVE_CHART,
        payload: {
          chart,
          iso,
          data: response.rows
        }
      }));
  };
}

export function fetchBoxAndWhiskers(chart, iso) {
  const sql = `
    SELECT swl, variable,
      ARRAY_AGG(model_short_name) as models,
      ARRAY_AGG(institution) as institutions,
      PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY min) AS min_q1,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY min) AS min_median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY min) AS min_q3,
      MAX(min) AS min_maximum,
      MIN(min) AS min_minimum,
      ARRAY_AGG(min ORDER BY min ASC) AS min_values,
      PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY max) AS max_q1,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY max) AS max_median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY max) AS max_q3,
      MAX(max) AS max_maximum,
      MIN(max) AS max_minimum,
      ARRAY_AGG(max ORDER BY max ASC) AS max_values,
      PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY mean) AS mean_q1,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY mean) AS mean_median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY mean) AS mean_q3,
      MAX(mean) AS mean_maximum,
      MIN(mean) AS mean_minimum,
      ARRAY_AGG(mean ORDER BY mean ASC) AS mean_values,
      PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY std) AS std_q1,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY std) AS std_median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY std) AS std_q3,
      MAX(std) AS std_maximum,
      MIN(std) AS std_minimum,
      ARRAY_AGG(std ORDER BY std ASC) AS std_values
    FROM (
      SELECT swl_info AS swl,
             run,
             model_short_name,
             institution,
             variable,
      		 CASE WHEN variable LIKE '%biodiversity' THEN min*100 ELSE min END AS min,
      		 CASE WHEN variable LIKE '%biodiversity' THEN max*100 ELSE max END AS max,
      		 CASE WHEN variable LIKE '%biodiversity' THEN mean*100 ELSE mean END AS mean,
      		 CASE WHEN variable LIKE '%biodiversity' THEN std*100 ELSE std END AS std
      FROM master_admin0
      WHERE iso = '${iso}'
      AND swl_info < 6
      ORDER BY swl
    ) data
    GROUP BY swl, variable
  `;

  return (dispatch) => {
    dispatch({
      type: LOAD_CHART,
      payload: {
        chart,
        iso
      }
    });

    return cartoQuery(sql)
      .then((response) => response.json())
      .then((response) => dispatch({
        type: RECEIVE_CHART,
        payload: {
          chart,
          iso,
          data: response.rows
        }
      }));
  };
}
