import { GET_COUNTRIES_LIST, GET_COUNTRY_DATA } from 'actions/countries';

const initialState = {
  countriesList: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES_LIST:
      return Object.assign({}, state, { countriesList: action.payload });
    case GET_COUNTRY_DATA:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
