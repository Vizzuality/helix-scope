import $ from 'jquery';
import { push } from 'react-router-redux';
import { ENDPOINT_TILES, ENDPOINT_SQL, MAX_MAPS } from 'constants/map';

export const MAP_UPDATE_DATA = 'MAP_UPDATE_DATA';
export const MAP_UPDATE_PAN = 'MAP_UPDATE_PAN';
export const MAP_SAVE_PARAMS = 'MAP_SAVE_PARAMS';
export const LOADING_MAP = 'LOADING_MAP';

function getRandomId() {
  return Math.floor(Math.random() * 100).toString();
}

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
          id: getRandomId(),
          scenario: config.scenarios.find((elem) => (
            elem.slug === params[0]
          )),
          category,
          indicator: category.indicator.find((elem) => (
            elem.slug === params[2]
          )),
          measure: config.measurements.find((elem) => (
            elem.slug === params[3]
          )),
          season: parseInt(params[4], 10)
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
        query += `${map.scenario.slug},${map.category.slug},${map.indicator.slug},${map.measure.slug},${map.season}`;

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
        selectedMap.bucket = [];
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
        layer: {
          tileUrl: `${ENDPOINT_TILES}${res.layergroupid}/{z}/{x}/{y}@2x.png32`,
          slug: `layer_${mapData.indicator.slug}_${mapData.measure.slug}_${mapData.scenario.slug}_${mapData.season}`
        }
      }));
    });
  };
}

export function getMapBuckets(mapData) {
  return (dispatch) => {
    let raster = false;

    if (!mapData.raster) {
      raster = true;
    }

    const query = `SELECT * FROM get_buckets('${mapData.indicator.tableName}', ${raster}, '${mapData.measure.slug}', ${mapData.scenario.slug}, ${mapData.season})`;

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
