import { GET_COUNTRIES_LIST, GET_COUNTRY_DATA } from 'actions/countries';

const initialState = {
  countriesList: [],
  countriesData: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES_LIST:
      return Object.assign({}, state, { countriesList: action.payload });
    case GET_COUNTRY_DATA: {
      const countriesData = Object.assign({}, state.countriesData, {});
      countriesData[action.payload.iso] = action.payload;
      return Object.assign({}, state, { countriesData });
    }
    default:
      return state;
  }
}
