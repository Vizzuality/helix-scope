import { connect } from 'react-redux';

import CountryPageChart from 'components/charts/CountryPageChart';

const mapStateToProps = ({ charts }) => ({
  chartData: charts
});

export default connect(mapStateToProps)(CountryPageChart);
