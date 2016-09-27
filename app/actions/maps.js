import $ from 'jquery';
import { push } from 'react-router-redux';
import { ENDPOINT_TILES, ENDPOINT_SQL, MAX_MAPS, MAP_NUMBER_BUCKETS } from 'constants/map';

export const MAP_UPDATE_DATA = 'MAP_UPDATE_DATA';
export const MAP_UPDATE_PAN = 'MAP_UPDATE_PAN';
export const LOADING_MAP = 'LOADING_MAP';

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
    const table = 'o_1_avg_temperature_sepoctnov_max';
    const vector = `SELECT unnest(CDB_JenksBins(array_agg(distinct((area::numeric))), ${MAP_NUMBER_BUCKETS})) as value from ${table} order by value DESC`;

    // // BUCKETS
    // //
    // with r as (select value, iso from avg_temperature where measure like 'sd' and scenario = 2 and season=1 )
    //
    // SELECT unnest(CDB_JenksBins(array_agg(distinct((value::numeric))), 6)) as value from r order by value DESC
    //
    // // GEOM
    //
    // with r as (select value, iso from {{table_name}} where measure like 'sd' and scenario = 2 and season=1 )
    //
    // select r.iso, value, the_geom_webmercator from r inner join country_geoms s on r.iso=s.iso
    //
    // // RASTER
    //
    const raster = `with r as ( SELECT ST_ValueCount(the_raster_webmercator) As val, ST_BandNoDataValue(the_raster_webmercator, 1) as noDataValue FROM ${table} ) SELECT unnest(CDB_JenksBins(array_agg((val).value::numeric), ${MAP_NUMBER_BUCKETS})) as value, min((val).value::numeric), noDataValue  FROM r group by noDataValue ORDER BY value ASC`;


    $.get({
      url: ENDPOINT_SQL,
      data: {
        q: raster
      }
    }).then((res) => {
      dispatch(setMapData(mapData, {
        bucket: res.rows
      }));
    });
  };
}
