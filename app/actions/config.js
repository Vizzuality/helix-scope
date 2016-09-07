export const LOAD_CONFIG = 'LOAD_CONFIG';
export const RECEIVE_CONFIG = 'RECEIVE_CONFIG';

export function loadConfig() {
  return {
    type: LOAD_CONFIG
  };
}

export function receiveConfig({...config}) {
  return {
    type: RECEIVE_CONFIG,
    ...config
  };
}

export function fetchConfig() {
  return dispatch => {
    dispatch(loadConfig());
    return fetch('/app_config.json')
      .then(response => response.json())
      .then(json => {
        const config = json.data.attributes;
        dispatch(receiveConfig({...config}));
      });
  };
}
