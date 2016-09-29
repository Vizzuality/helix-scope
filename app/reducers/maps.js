import { MAP_SAVE_PARAMS, MAP_UPDATE_DATA, MAP_UPDATE_PAN, LOADING_MAP } from 'actions/maps';

const initialState = {
  mapsList: [],
  initialParams: [],
  zoom: 3,
  layer: '',
  latLng: {
    lat: 25.657,
    lng: -102.299
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case MAP_SAVE_PARAMS: {
      return Object.assign({}, state, { initialParams: action.payload });
    }
    case MAP_UPDATE_DATA: {
      return Object.assign({}, state, { mapsList: action.payload });
    }
    case MAP_UPDATE_PAN: {
      return Object.assign({}, state, {
        zoom: action.payload.zoom,
        latLng: {
          lat: action.payload.latLng.lat,
          lng: action.payload.latLng.lng
        }
      });
    }
    case LOADING_MAP: {
      return Object.assign({}, state, { loading: action.payload.loading });
    }
    default:
      return state;
  }
}
