import { connect } from 'react-redux';
import Map from 'components/maps/Map';
import { panMaps, updateURL } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  latLng: state.maps.latLng,
  zoom: state.maps.zoom
});


const mapDispatchToProps = dispatch => ({
  onMapDrag: params => {
    dispatch(panMaps(params));
    dispatch(updateURL());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
