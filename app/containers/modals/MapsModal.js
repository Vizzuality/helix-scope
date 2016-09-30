import { connect } from 'react-redux';
import MapsModal from 'components/modals/MapsModal';
import { setMap } from 'actions/maps';

const mapStateToProps = state => ({
  config: state.config
});

const mapDispatchToProps = dispatch => ({
  setMapState: params => {
    dispatch(setMap(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsModal);
