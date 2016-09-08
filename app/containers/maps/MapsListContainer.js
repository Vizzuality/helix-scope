import { connect } from 'react-redux';
import MapsList from 'components/maps/MapsList';
import { panMaps, updateURL } from 'actions/maps';

const mapDispatchToProps = dispatch => ({
  onMapDrag: params => {
    dispatch(panMaps(params));
    dispatch(updateURL());
  }
});

export default connect(null, mapDispatchToProps)(MapsList);
