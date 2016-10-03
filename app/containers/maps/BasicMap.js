import { connect } from 'react-redux';
import BasicMap from 'components/maps/BasicMap';

const mapStateToProps = state => ({
  mapConfig: {
    latLng: state.maps.latLng,
    zoom: state.maps.zoom
  }
});


const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BasicMap);
