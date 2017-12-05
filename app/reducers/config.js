import { LOAD_CONFIG, RECEIVE_CONFIG } from 'actions/config';

const initialState = {
  loading: true,
  scenarios: [],
  categories: [],
  measurements: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIG:
      return {
        ...state,
        loading: true
      };

    case RECEIVE_CONFIG:
      return {
        ...state,
        ...action.payload,
        loading: false
      };

    default:
      return state;
  }
}
