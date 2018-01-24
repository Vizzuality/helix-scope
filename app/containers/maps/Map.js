import { connect } from 'react-redux';
import Map from 'components/maps/Map';
import {
  createLayer,
  getMapBoxData,
  getMapBuckets,
  panMaps,
  updateURL
} from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  mapConfig: {
    latLng: state.maps.latLng,
    zoom: state.maps.zoom,
    source: state.maps.source
  }
});

const mapDispatchToProps = dispatch => ({
  onMapDrag: params => {
    dispatch(panMaps(params));
    dispatch(updateURL());
  },
  onMapClick: params => {
    dispatch(getMapBoxData(params));
  },
  createLayer: (mapData, layer) => {
    dispatch(createLayer(mapData, layer));
  },
  getMapBuckets: params => {
    dispatch(getMapBuckets(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
