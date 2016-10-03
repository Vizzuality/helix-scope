import { connect } from 'react-redux';
import CompareResultsPage from 'components/pages/CompareResultsPage';
import { getCountryData } from 'actions/countries';

const mapStateToProps = (state, { params }) => ({
  countriesList: state.countries.countriesList,
  iso1: params.iso1,
  iso2: params.iso2,
  countryData1: state.countries.countriesData[params.iso1] || false,
  countryData2: state.countries.countriesData[params.iso2] || false
});

const mapDispatchToProps = dispatch => ({
  getCountryData: (iso) => dispatch(getCountryData(iso))
});

export default connect(mapStateToProps, mapDispatchToProps)(CompareResultsPage);
