import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import CompareResultsPage from 'components/pages/CompareResultsPage';
import {
  fetchInterQuartileRange,
  fetchRegularBar,
  fetchBoxAndWhiskers
} from 'actions/charts';

const mapStateToProps = (state, { params }) => ({
  config: state.config,
  countriesList: state.countries.countriesList,
  iso1: params.iso1,
  iso2: params.iso2
});

const mapDispatchToProps = dispatch => ({
  fetchInterQuartileRange: (...args) => dispatch(fetchInterQuartileRange(...args)),
  fetchRegularBar: (...args) => dispatch(fetchRegularBar(...args)),
  fetchBoxAndWhiskers: (...args) => dispatch(fetchBoxAndWhiskers(...args)),
  updateCompareUrl: (iso1, iso2) => dispatch(push(`/compare/${iso1}/${iso2}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(CompareResultsPage);
