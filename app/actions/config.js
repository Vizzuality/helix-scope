import cartoQuery from 'utils/cartoQuery';

export const LOAD_CONFIG = 'LOAD_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';

export function fetchConfig() {
  const order = (s1, s2) => s1.name > s2.name;
  const sql = 'SELECT * FROM get_config()';

  return dispatch => {
    dispatch({
      type: LOAD_CONFIG
    });

    return cartoQuery(sql)
      .then(json => json.data.rows[0].get_config)
      .then(config => dispatch({
        type: RECEIVE_CONFIG,
        payload: {
          ...config,
          scenarios: config.scenarios.sort(order),
          categories: config.categories.map((category) => ({
            ...category,
            indicators: category.indicators.sort(order)
          })).sort(order)
        }
      }));
  };
}
