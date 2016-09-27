export const LOAD_CONFIG = 'LOAD_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';

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
    return fetch('https://helixscope.carto.com/api/v2/sql?q=select%20*%20from%20get_config()')
      .then(response => response.json())
      .then(json => {
        const config = json.rows[0].get_config;
        dispatch(receiveConfig(config));
      });
  };
}
