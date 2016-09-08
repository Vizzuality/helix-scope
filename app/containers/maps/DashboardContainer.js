import { connect } from 'react-redux';
import Dashboard from 'components/maps/Dashboard';

const mapStateToProps = state => ({
  config: state.config
});

export default connect(mapStateToProps, null)(Dashboard);
