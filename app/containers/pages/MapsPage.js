import { connect } from 'react-redux';
import MapsPage from 'components/pages/MapsPage';
import { initializeMaps, saveParamsFromURL } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  config: state.config
});

const mapDispatchToProps = dispatch => ({
  saveParamsFromURL: params => {
    dispatch(saveParamsFromURL(params));
  },
  initializeMaps: () => {
    dispatch(initializeMaps());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
