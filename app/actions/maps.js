import $ from 'jquery';
import { push } from 'react-router-redux';
import { ENDPOINT_TILES, ENDPOINT_SQL, MAX_MAPS, MAP_NUMBER_BUCKETS } from 'constants/map';

export const MAP_UPDATE_DATA = 'MAP_UPDATE_DATA';
export const MAP_UPDATE_PAN = 'MAP_UPDATE_PAN';
export const LOADING_MAP = 'LOADING_MAP';

function getRandomId() {
  return Math.floor(Math.random() * 100).toString();
}

export function setParamsFromURL(data) {
  return dispatch => {
    const urlParams = data.split('/');
    const mapsList = [];

    if (urlParams.length && urlParams.length <= MAX_MAPS) {
      urlParams.forEach((map) => {
        const params = map.split(',');
        mapsList.push({
          id: getRandomId(),
          scenario: params[0],
          category: params[1],
          indicator: params[2],
          measure: params[3]
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
        query += `${map.scenario},${map.category},${map.indicator},${map.measure}`;

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

      let selectedMap = mapsList.find((elem) => (
        elem.id === map.id
      ));
      if (selectedMap) {
        selectedMap = Object.assign(selectedMap, map);
      } else {
        const newMap = map;
        newMap.id = getRandomId();
        mapsList.push(newMap);
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
    const mapsList = maps.filter((elem) => (
      elem.id !== mapId
    ));

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

function setMapData(mapData, newData) {
  return (dispatch, state) => {
    const maps = state().maps.mapsList;
    const mapsList = [];
    maps.forEach(map => {
      let currentMap = map;
      if (currentMap.id === mapData.id) {
        currentMap = Object.assign(currentMap, newData);
      }
      mapsList.push(currentMap);
    });

    dispatch({
      type: MAP_UPDATE_DATA,
      payload: mapsList
    });
  };
}

export function createLayer(mapData, layerData) {
  return (dispatch) => {
    $.post({
      url: ENDPOINT_TILES,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: layerData
    }).then((res) => {
      dispatch(setMapData(mapData, {
        layer: `${ENDPOINT_TILES}${res.layergroupid}/{z}/{x}/{y}.png32`
      }));
    });
  };
}

export function getMapBuckets(mapData) {
  return (dispatch) => {
    let query = 'SELECT * FROM get_buckets(\'avg_temperature\', false, \'max\', 2, 2)';

    if (mapData.raster) {
      query = 'SELECT * FROM get_buckets(\'avg_temperature_sepoctnov_min\', true)';
    }

    $.get({
      url: ENDPOINT_SQL,
      data: {
        q: query
      }
    }).then((res) => {
      dispatch(setMapData(mapData, {
        bucket: res.rows
      }));
    });
  };
}
