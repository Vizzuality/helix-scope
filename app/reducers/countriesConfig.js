const initialState = {
  countriesList: []
};

function setCountriesList(state, countriesList) {
  const newState = Object.assign({}, state, { countriesList });
  return newState;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_COUNTRIES_LIST':
      return setCountriesList(state, action.countriesList);
    default:
      return state;
  }
}
