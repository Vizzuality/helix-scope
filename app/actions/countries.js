import { push } from 'react-router-redux';
import { ENDPOINT_SQL } from 'constants/map';

export const GET_COUNTRY_DATA = 'GET_COUNTRY_DATA';
export const GET_COUNTRIES_LIST = 'GET_COUNTRIES_LIST';

export function fetchCountriesList() {
  const url = `${ENDPOINT_SQL}?q=SELECT%20name_engli%20as%20name,%20iso%20FROM%20country_geoms%20ORDER%20BY%20name%20ASC`;
  return dispatch => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        dispatch({
          type: GET_COUNTRIES_LIST,
          payload: data.rows
        });
      });
  };
}

export function getCountryData(iso) {
  const url = `${ENDPOINT_SQL}?q=select * from get_country('${iso}')`;
  return dispatch => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const countryData = {};
        countryData.indicators = data.rows;
        countryData.iso = iso;
        dispatch({
          type: GET_COUNTRY_DATA,
          payload: countryData
        });
      });
  };
}

export function goToCountry(slug) {
  return (dispatch) => {
    dispatch(push(`/countries/${slug}`));
  };
}
