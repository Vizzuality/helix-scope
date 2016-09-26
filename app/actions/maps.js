import $ from 'jquery';
import { push } from 'react-router-redux';

export const MAP_UPDATE_DATA = 'MAP_UPDATE_DATA';
export const MAP_UPDATE_PAN = 'MAP_UPDATE_PAN';
export const LOADING_MAP = 'LOADING_MAP';

const CARTODB_USER = 'helixscope';
const ENDPOINT_TILES = `https://${CARTODB_USER}.carto.com/api/v1/map/`;
const MAX_MAPS = 4;

export function setParamsFromURL(data) {
  return dispatch => {
    const urlParams = data.split('/');
    const mapsList = [];

    if (urlParams.length && urlParams.length <= MAX_MAPS) {
      urlParams.forEach((map, index) => {
        const params = map.split(',');
        mapsList.push({
          id: index.toString(),
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
        const newMap = map;
        newMap.id = mapsList.length.toString();
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

function getLayerTypeSpec(type) {
  const spec = {
    layers: [{
      user_name: CARTODB_USER,
      type: 'cartodb',
      options: {
        sql: '',
        cartocss: '',
        cartocss_version: '2.3.0'
      }
    }]
  };

  if (type === 'raster') {
    const layerSpecOptions = spec.layers[0].options;
    layerSpecOptions.raster = true;
    layerSpecOptions.raster_band = 1;
    layerSpecOptions.geom_column = 'the_raster_webmercator';
    layerSpecOptions.geom_type = 'raster';
  }
  return spec;
}

function getLayerData(data) {
  const spec = Object.assign({}, getLayerTypeSpec(data.layer.type));
  const layerOptions = spec.layers[0].options;

  layerOptions.sql = data.layer.sql;
  layerOptions.cartocss = data.layer.cartocss;

  return JSON.stringify(spec);
}

function setMapLayer(data, tileUrl) {
  return (dispatch, state) => {
    const maps = state().maps.mapsList;
    const mapsList = [];
    maps.forEach(map => {
      const currentMap = map;
      if (currentMap.id === data.map) {
        currentMap.layer = tileUrl;
      }
      mapsList.push(currentMap);
    });

    dispatch({
      type: MAP_UPDATE_DATA,
      payload: mapsList
    });
  };
}

export function createLayer(data) {
  return (dispatch) => {
    $.post({
      url: ENDPOINT_TILES,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: getLayerData(data.layer)
    }).then((res) => {
      const tileUrl = `${ENDPOINT_TILES}${res.layergroupid}/{z}/{x}/{y}.png32`;
      dispatch(setMapLayer(data.layer, tileUrl));
    });
  };
}
