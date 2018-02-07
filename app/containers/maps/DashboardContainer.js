import { connect } from 'react-redux';
import Dashboard from 'components/maps/Dashboard';
import { deleteMap, setMap } from 'actions/maps';

const mapStateToProps = state => ({
  showDeleteBtn: state.maps.mapsList.length > 1
});

const mapDispatchToProps = dispatch => ({
  deleteMap: params => {
    dispatch(deleteMap(params));
  },
  setMapState: params => {
    dispatch(setMap(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
