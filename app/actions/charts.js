import cartoQuery from 'utils/cartoQuery';
import flatMap from 'lodash/flatMap';

export const LOAD_CHART = 'LOAD_CHART';
export const RECEIVE_CHART = 'RECEIVE_CHART';

function fetchChartData(chart, sql, iso, transform) {
  return (dispatch) => {
    dispatch({
      type: LOAD_CHART,
      payload: {
        chart,
        iso
      }
    });

    return cartoQuery(sql)
      .then((response) => response.data.rows)
      .then((response) => (transform ? transform(response) : response))
      .then((data) => dispatch({
        type: RECEIVE_CHART,
        payload: {
          chart,
          iso,
          data
        }
      }))
      .catch((error) => {
        console.error(error);
        dispatch({
          type: RECEIVE_CHART,
          payload: {
            chart,
            iso,
            data: []
          }
        });
      });
  };
}

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

  return fetchChartData(chart, sql, iso);
}

export function fetchRegularBar(chart, iso, variable) {
  const sql = `
    SELECT mean as value, swl_info as swl, variable, institution, model_short_name AS model
    FROM master_admin0
    WHERE variable = '${variable}'
    AND iso = '${iso}'
    AND swl_info < 6
    ORDER BY swl
  `;

  return fetchChartData(chart, sql, iso);
}

export function fetchBoxAndWhiskers(chart, iso, variable, measure) {
  const sql = `
    SELECT
      swl_info as swl,
      ARRAY_AGG(model_short_name) as models,
      ARRAY_AGG(institution) as institutions,
      PERCENTILE_CONT(0.25) WITHIN GROUP(ORDER BY ${measure}) AS q1,
      PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY ${measure}) AS median,
      PERCENTILE_CONT(0.75) WITHIN GROUP(ORDER BY ${measure}) AS q3,
      MAX(${measure}) AS maximum,
      MIN(${measure}) AS minimum,
      ARRAY_AGG(${measure} ORDER BY ${measure} ASC) AS values
    FROM master_admin0
    WHERE iso = '${iso}'
      AND variable = '${variable}'
      AND swl_info < 6
    GROUP BY swl
    ORDER BY swl
  `;

  return fetchChartData(`${chart}_${variable}_${measure}`, sql, iso);
}

export function fetchSummary(chart, iso, variable) {
  const sql = `
    SELECT
      AVG(min) AS min,
      AVG(mean) AS mean,
      AVG(max) AS max,
      ARRAY_AGG(DISTINCT model_short_name) as models,
      ARRAY_AGG(DISTINCT institution) as institutions,
      swl_info AS swl
    FROM master_admin0
    WHERE variable = '${variable}'
      AND iso = '${iso}'
      AND swl_info < 6
    GROUP BY swl
    ORDER BY swl
  `;

  return fetchChartData(chart, sql, iso, (data) => (
    flatMap(data, (v) => ([
      { line: 'min', value: v.min, ...v },
      { line: 'mean', value: v.mean, ...v },
      { line: 'max', value: v.max, ...v }
    ]))
  ));
}

export function fetchTemperatureSummary(chart, iso) {
  const sql = `
    SELECT
      AVG(mean) AS value,
      ARRAY_AGG(DISTINCT model_short_name) as models,
      ARRAY_AGG(DISTINCT institution) as institutions,
      swl_info AS swl,
      variable AS line
    FROM master_admin0
    WHERE variable IN ('tx', 'tn', 'ts')
      AND iso = '${iso}'
      AND swl_info < 6
    GROUP BY swl_info, variable
    ORDER BY swl
  `;

  return fetchChartData(chart, sql, iso, (data) => {
    const lineMap = {
      tn: 'min',
      ts: 'mean',
      tx: 'max'
    };

    return data.map((v) => ({
      ...v,
      line: lineMap[v.line]
    }));
  });
}
