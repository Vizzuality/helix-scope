import { push } from 'react-router-redux';
import cartoQuery from 'utils/cartoQuery';

export const LOAD_COUNTRY_LIST = 'LOAD_COUNTRY_LIST';
export const RECEIVE_COUNTRY_LIST = 'RECEIVE_COUNTRY_LIST';

export function fetchCountryList() {
  const sql = 'SELECT name_engli AS name, iso FROM country_geoms ORDER BY name ASC';
  return dispatch => {
    dispatch({
      type: LOAD_COUNTRY_LIST
    });

    cartoQuery(sql)
      .then((response) => dispatch({
        type: RECEIVE_COUNTRY_LIST,
        payload: response.data.rows
      }));
  };
}

export function goToCountry(slug) {
  return (dispatch) => {
    dispatch(push(`/countries/${slug}`));
  };
}
