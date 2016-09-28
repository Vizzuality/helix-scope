import { connect } from 'react-redux';
import MapsPage from 'components/pages/MapsPage';
import { setParamsFromURL } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  config: state.config
});

const mapDispatchToProps = dispatch => ({
  setParamsFromURL: params => {
    dispatch(setParamsFromURL(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
