import { connect } from 'react-redux';
import MapsPage from 'components/pages/MapsPage';
import { initializeMaps, saveParamsFromURL, updateURL } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  config: state.config
});

const mapDispatchToProps = {
  saveParamsFromURL,
  initializeMaps,
  updateURL
};

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
