import { LOAD_HEADLINES, RECEIVE_HEADLINES, SHOW_HEADLINE } from 'actions/headlines';

const initialState = {
  loading: false,
  headlines: [],
  currentHeadlineIndex: 0
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_HEADLINES: {
      return Object.assign({}, state, {
        loading: true
      });
    }
    case RECEIVE_HEADLINES: {
      return Object.assign({}, state, {
        loading: false,
        headlines: action.headlines
      });
    }
    case SHOW_HEADLINE: {
      return Object.assign({}, state, {
        currentHeadlineIndex: action.headlineIndex
      });
    }
    default:
      return state;
  }
}
