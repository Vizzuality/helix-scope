import { LOAD_CHART, RECEIVE_CHART } from 'actions/charts';

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CHART:
      return {
        ...state,
        ...{
          [action.payload.chart]: {
            loading: true,
            data: []
          }
        }
      };

    case RECEIVE_CHART:
      return {
        ...state,
        ...{
          [action.payload.chart]: {
            loading: false,
            data: action.payload.data
          }
        }
      };

    default:
      return state;
  }
}
