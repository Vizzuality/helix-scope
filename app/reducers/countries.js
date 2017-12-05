import {
  LOAD_COUNTRY_LIST,
  RECEIVE_COUNTRY_LIST,
  LOAD_COUNTRY_DETAIL,
  RECEIVE_COUNTRY_DETAIL
} from 'actions/countries';

const initialState = {
  countriesList: [],
  countriesData: {}
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

    case LOAD_COUNTRY_DETAIL:
      return {
        ...state,
        loading: true
      };

    case RECEIVE_COUNTRY_DETAIL:
      return {
        ...state,
        countriesData: {
          ...state.countriesData,
          [action.payload.iso]: action.payload
        },
        loading: false
      };

    default:
      return state;
  }
}
