import { connect } from 'react-redux';
import MapsList from 'components/maps/MapsList';
import { panMaps, updateURL, createLayer } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  mapConfig: {
    latLng: state.maps.latLng,
    zoom: state.maps.zoom
  }
});


const mapDispatchToProps = dispatch => ({
  onMapDrag: params => {
    dispatch(panMaps(params));
    dispatch(updateURL());
  },
  createLayer: params => {
    dispatch(createLayer(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsList);
