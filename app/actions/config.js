export const LOAD_CONFIG = 'LOAD_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';
import { initializeMaps } from 'actions/maps';
import { ENDPOINT_SQL } from 'constants/map';

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
      .then(json => {
        const config = json.rows[0].get_config;
        dispatch(receiveConfig(config));
        dispatch(initializeMaps());
      });
  };
}
