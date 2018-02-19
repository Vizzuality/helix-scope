import {
  LOAD_COUNTRY_LIST,
  RECEIVE_COUNTRY_LIST
} from 'actions/countries';

const initialState = {
  countriesList: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_COUNTRY_LIST:
      return {
        ...state,
        loading: true
      };
    case RECEIVE_COUNTRY_LIST:
      return {
        ...state,
        countriesList: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
