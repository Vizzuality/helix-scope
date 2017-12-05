import { connect } from 'react-redux';
import Chart from 'components/common/Chart';

const mapStateToProps = state => ({
  scenarios: state.config.scenarios,
  categories: state.config.categories,
  measurements: state.config.measurements
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
