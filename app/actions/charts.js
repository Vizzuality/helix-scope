import cartoQuery from 'utils/cartoQuery';

export const LOAD_CHART = 'LOAD_CHART';
export const RECEIVE_CHART = 'RECEIVE_CHART';

export function fetchInterQuartileRange(chart, iso, variable) {
  const sql = `
    SELECT swl, variable,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY value) AS median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY value) - PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY value) AS iqr,
      ARRAY_AGG(value ORDER BY value ASC) AS values
    FROM (
      SELECT mean as value, swl_info as swl, variable
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
        chart
      }
    });

    return cartoQuery(sql)
      .then((response) => response.json())
      .then((response) => dispatch({
        type: RECEIVE_CHART,
        payload: {
          chart,
          data: response.rows
        }
      }));
  };
}

export function fetchRegularBar(chart, iso, variable) {
  const sql = `
    SELECT mean / 10e6 as value, swl_info as swl, variable, institution, model_short_name
    FROM master_admin0
    WHERE variable = '${variable}'
    AND iso = '${iso}'
    AND swl_info < 6
  `;

  return (dispatch) => {
    dispatch({
      type: LOAD_CHART,
      payload: {
        chart
      }
    });

    return cartoQuery(sql)
      .then((response) => response.json())
      .then((response) => dispatch({
        type: RECEIVE_CHART,
        payload: {
          chart,
          data: response.rows
        }
      }));
  };
}

export function fetchBoxAndWhiskers(chart, iso, variable, value) {
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

  const valueFactor = biodiversityVariables.indexOf(variable) > -1 ? 100 : 1;

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
        ${value} / ${valueFactor} as value, variable
      FROM master_admin0
      WHERE variable = '${variable}'
      AND iso = '${iso}'
      AND swl_info < 6
      ORDER BY swl
    ) data
    GROUP BY swl, variable
  `;

  return (dispatch) => {
    dispatch({
      type: LOAD_CHART,
      payload: {
        chart
      }
    });

    return cartoQuery(sql)
      .then((response) => response.json())
      .then((response) => dispatch({
        type: RECEIVE_CHART,
        payload: {
          chart,
          data: response.rows
        }
      }));
  };
}
