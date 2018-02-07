import { connect } from 'react-redux';

import DisplayCharts from 'components/charts/DisplayCharts';

const mapStateToProps = ({ charts, config }) => ({
  measurements: config.measurements,
  chartData: charts
});

export default connect(mapStateToProps)(DisplayCharts);
