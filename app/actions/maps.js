import axios from 'axios';
import { push } from 'react-router-redux';
import uuid from 'uuid/v4';
import { ENDPOINT_TILES, ENDPOINT_SQL, MAX_MAPS } from 'constants/map';

export const MAP_UPDATE_DATA = 'MAP_UPDATE_DATA';
export const MAP_UPDATE_PAN = 'MAP_UPDATE_PAN';
export const MAP_SAVE_PARAMS = 'MAP_SAVE_PARAMS';
export const LOADING_MAP = 'LOADING_MAP';

export function saveParamsFromURL(queryParam, mapConfig) {
  return dispatch => {
    let initialParams = [];
    if (queryParam) {
      initialParams = queryParam.split('/');
    }

    if (mapConfig) {
      dispatch({
        type: MAP_UPDATE_PAN,
        payload: {
          zoom: parseInt(mapConfig.zoom, 10),
          latLng: {
            lat: mapConfig.lat,
            lng: mapConfig.lng
          }
        }
      });
    }

    dispatch({
      type: MAP_SAVE_PARAMS,
      payload: initialParams
    });
  };
}

export function initializeMaps() {
  return (dispatch, state) => {
    const urlParams = state().maps.initialParams;
    const config = state().config;
    const mapsList = [];

    if (urlParams.length && urlParams.length <= MAX_MAPS) {
      for (let i = 0, paramsLength = urlParams.length; i < paramsLength; i++) {
        const params = urlParams[i].split(',');
        const category = config.categories.find((elem) => (
          elem.slug === params[1]
        ));
        mapsList.push({
          id: uuid(),
          scenario: config.scenarios.find((elem) => (
            elem.slug === params[0]
          )),
          category,
          indicator: category.indicators.find((elem) => (
            elem.slug === params[2]
          )),
          measure: config.measurements.find((elem) => (
            elem.slug === params[3]
          ))
        });
      }
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
        query += `${map.scenario.slug},${map.category.slug},${map.indicator.slug},${map.measure.slug}`;

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
        selectedMap = Object.assign(selectedMap, map, { bucket: [] });
      } else {
        const newMap = map;
        newMap.id = uuid();
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
    axios.post(ENDPOINT_TILES, layerData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(({ data }) => {
      dispatch(setMapData(mapData, {
        layer: {
          tileUrl: `${ENDPOINT_TILES}${data.layergroupid}/{z}/{x}/{y}@2x.png32`,
          slug: `layer_${mapData.indicator.slug}_${mapData.measure.slug}_${mapData.scenario.slug}_${uuid()}`
        }
      }));
    }).catch((error) => {
      console.error(error);
    });
  };
}

export function getMapBuckets(mapData) {
  return (dispatch) => {
    const query = `SELECT * FROM get_buckets('${mapData.indicator.slug}', '${mapData.measure.slug}', ${mapData.scenario.slug}, 7)`;

    axios.get(ENDPOINT_SQL, {
      params: {
        q: query
      }
    }).then(({ data }) => {
      dispatch(setMapData(mapData, {
        bucket: data.rows
      }));
    }).catch((error) => {
      console.error(error);
    });
  };
}
