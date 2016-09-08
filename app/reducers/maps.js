import { MAP_UPDATE_DATA, MAP_UPDATE_PAN } from 'actions/maps';

const initialState = {
  mapsList: [],
  zoom: 3,
  latLng: {
    lat: 25.657,
    lng: -102.299
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
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
    default:
      return state;
  }
}
