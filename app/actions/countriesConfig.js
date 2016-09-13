import $ from 'jquery';

export const GET_COUNTRIES_LIST = 'GET_COUNTRIES_LIST';

export function getCountriesList() {
  const url = 'https://goal16.cartodb.com/api/v2/sql?q=select%20%20iso,%20%20name,%20%20%20region_name%20from%20%20%20countries%20order%20by%20%20%20name';
  return dispatch => {
    $.get(url).then(countriesList => {
      dispatch({
        type: GET_COUNTRIES_LIST,
        countriesList: countriesList.rows
      });
    });
  };
}
