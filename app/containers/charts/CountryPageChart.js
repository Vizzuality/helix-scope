import { connect } from 'react-redux';

import CountryPageChart from 'components/charts/CountryPageChart';

const mapStateToProps = ({ charts, config }) => ({
  measurements: config.measurements,
  chartData: charts
});

export default connect(mapStateToProps)(CountryPageChart);
