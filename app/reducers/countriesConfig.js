import { GET_COUNTRIES_LIST } from 'actions/countriesConfig';

const initialState = {
  countriesList: []
};

function setCountriesList(state, countriesList) {
  const newState = Object.assign({}, state, { countriesList });
  return newState;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_COUNTRIES_LIST:
      return setCountriesList(state, action.countriesList);
    default:
      return state;
  }
}
