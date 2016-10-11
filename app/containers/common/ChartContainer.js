import { connect } from 'react-redux';
import Chart from 'components/common/Chart';

const mapStateToProps = state => ({
  scenarios: state.config.scenarios
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
