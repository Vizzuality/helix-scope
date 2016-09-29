import { push } from 'react-router-redux';

export const GET_COUNTRY_DATA = 'GET_COUNTRY_DATA';
export const GET_COUNTRIES_LIST = 'GET_COUNTRIES_LIST';

export function getCountriesList() {
  const url = 'https://helixscope.carto.com/api/v2/sql?q=SELECT%20name_engli%20as%20name,%20iso%20FROM%20country_geoms%20ORDER%20BY%20name%20ASC';
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

export function getCountryData(slug) {
  return {
    type: GET_COUNTRY_DATA,
    payload: { slug }
  };
}

export function goToCountry(slug) {
  return (dispatch) => {
    dispatch(push(`/countries/${slug}`));
  };
}
