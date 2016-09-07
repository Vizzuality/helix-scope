import { push } from 'react-router-redux';

export const MAP_UPDATE_DATA = 'MAP_UPDATE_DATA';
export const MAP_UPDATE_PAN = 'MAP_UPDATE_PAN';

const MAX_MAPS = 4;

export function setParamsFromURL(data) {
  return dispatch => {
    const urlParams = data.split('/');
    const mapsList = [];

    if (urlParams.length && urlParams.length <= MAX_MAPS) {
      urlParams.forEach((map, index) => {
        const params = map.split(',');
        mapsList.push({
          id: index,
          scenario: params[0],
          category: params[1],
          indicator: params[2]
        });
      });
    }
    dispatch({
      type: MAP_UPDATE_DATA,
      payload: mapsList
    });
  };
}

export function updateURL() {
  return (dispatch, state) => {
    const maps = state().maps;
    const params = `${maps.latLng.lat}/${maps.latLng.lng}/${maps.zoom}`;
    let query = '';

    if (maps.mapsList.length) {
      query = '?maps=';

      maps.mapsList.forEach((map, index) => {
        query += `${map.scenario},${map.category},${map.indicator}`;

        if (index < maps.mapsList.length - 1) {
          query += '/';
        }
      });
    }
    dispatch(push(`/global-scenarios/${params}${query}`));
  };
}

export function setMap(map) {
  return (dispatch, state) => {
    const maps = state().maps.mapsList;
    const mapsList = [];
    if (maps.length <= MAX_MAPS) {
      maps.forEach(mapItem => {
        mapsList.push(mapItem);
      });

      if (mapsList[map.id]) {
        mapsList[map.id] = map;
      } else {
        mapsList.push(map);
      }

      dispatch({
        type: MAP_UPDATE_DATA,
        payload: mapsList
      });
      dispatch(updateURL());
    }
  };
}

export function deleteMap(mapId) {
  return (dispatch, state) => {
    const maps = state().maps.mapsList;
    maps.splice(mapId, 1);
    const mapsList = [];
    maps.forEach(map => {
      mapsList.push(map);
    });

    dispatch({
      type: MAP_UPDATE_DATA,
      payload: mapsList
    });
    dispatch(updateURL());
  };
}

export function panMaps(panParams) {
  return {
    type: MAP_UPDATE_PAN,
    payload: panParams
  };
}
