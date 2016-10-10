import { connect } from 'react-redux';
import MapsPage from 'components/pages/MapsPage';
import { initializeMaps, saveParamsFromURL, updateURL } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  config: state.config
});

const mapDispatchToProps = dispatch => ({
  saveParamsFromURL: (mapParams, mapConfig) => {
    dispatch(saveParamsFromURL(mapParams, mapConfig));
  },
  initializeMaps: () => {
    dispatch(initializeMaps());
  },
  updateURL: () => {
    dispatch(updateURL());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
