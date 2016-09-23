import { push } from 'react-router-redux';

export const GET_COUNTRY_DATA = 'GET_COUNTRY_DATA';

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
