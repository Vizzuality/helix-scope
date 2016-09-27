import { LOAD_CONFIG, RECEIVE_CONFIG } from 'actions/config';

const initialState = {
  loading: true,
  scenarios: [],
  categories: [],
  indicators: [],
  measurements: []
};
export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CONFIG: {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case RECEIVE_CONFIG: {
      const config = action.payload;
      config.loading = false;
      return Object.assign({}, state, config);
    }
    default:
      return state;
  }
}
