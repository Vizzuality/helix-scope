import { connect } from 'react-redux';
import Dashboard from 'components/maps/Dashboard';
import { deleteMap } from 'actions/maps';

const mapStateToProps = state => ({
  maps: state.maps.mapsList
});

const mapDispatchToProps = dispatch => ({
  deleteMap: params => {
    dispatch(deleteMap(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
