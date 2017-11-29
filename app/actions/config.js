export const LOAD_CONFIG = 'LOAD_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
import { ENDPOINT_SQL } from 'constants/map';

const sorter = (s1, s2) => s1.name > s2.name;

export function loadConfig() {
  return {
    type: LOAD_CONFIG
  };
}

export function receiveConfig(config) {
  return {
    type: RECEIVE_CONFIG,
    payload: config
  };
}

export function fetchConfig() {
  return dispatch => {
    dispatch(loadConfig());
    return fetch(`${ENDPOINT_SQL}?q=select%20*%20from%20get_config()`)
      .then(response => response.json())
      .then(json => json.rows[0].get_config)
      .then(config => dispatch(receiveConfig({
        ...config,
        scenarios: config.scenarios.sort(sorter),
        categories: config.categories.map((category) => ({
          ...category,
          indicators: category.indicators.sort(sorter)
        })).sort(sorter)
      })));
  };
}
