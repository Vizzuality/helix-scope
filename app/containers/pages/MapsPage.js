import { connect } from 'react-redux';
import MapsPage from 'components/pages/MapsPage';
import { saveParamsFromURL } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList,
  config: state.config
});

const mapDispatchToProps = dispatch => ({
  saveParamsFromURL: params => {
    dispatch(saveParamsFromURL(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
