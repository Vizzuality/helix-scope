import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import CompareResultsPage from 'components/pages/CompareResultsPage';

const mapStateToProps = (state, { params }) => ({
  chartData: state.charts,
  config: state.config,
  countriesList: state.countries.countriesList,
  iso1: params.iso1,
  iso2: params.iso2
});

const mapDispatchToProps = dispatch => ({
  updateCompareUrl: (iso1, iso2) => dispatch(push(`/compare/${iso1}/${iso2}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(CompareResultsPage);
