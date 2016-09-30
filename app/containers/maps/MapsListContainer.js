import { connect } from 'react-redux';
import MapsList from 'components/maps/MapsList';

const mapStateToProps = state => ({
  maps: state.maps.mapsList
});


export default connect(mapStateToProps, null)(MapsList);
