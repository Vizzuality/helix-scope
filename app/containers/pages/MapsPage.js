import { connect } from 'react-redux';
import MapsPage from 'components/pages/MapsPage';
import { setParamsFromURL, setMap, deleteMap } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  latLng: state.maps.latLng,
  zoom: state.maps.zoom,
  scenarios: state.config.scenarios,
  categories: state.config.categories,
  indicators: state.config.indicators
});

const mapDispatchToProps = dispatch => ({
  setParamsFromURL: params => {
    dispatch(setParamsFromURL(params));
  },
  setMap: params => {
    dispatch(setMap(params));
  },
  deleteMap: params => {
    dispatch(deleteMap(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
