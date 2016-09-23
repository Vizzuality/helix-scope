import { GET_COUNTRY_DATA } from 'actions/countries';

export default function (state = {}, action) {
  switch (action.type) {
    case GET_COUNTRY_DATA:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
