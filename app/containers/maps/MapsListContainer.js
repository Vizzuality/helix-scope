import { connect } from 'react-redux';
import MapsList from 'components/maps/MapsList';
import { panMaps, updateURL } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList
});


export default connect(mapStateToProps, null)(MapsList);
