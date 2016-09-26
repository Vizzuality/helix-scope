import { connect } from 'react-redux';
import Dashboard from 'components/maps/Dashboard';

const mapStateToProps = state => ({
  config: state.config,
  maps: state.maps.mapsList
});

export default connect(mapStateToProps, null)(Dashboard);
