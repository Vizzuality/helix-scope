import { connect } from 'react-redux';
import CountriesDetailPage from 'components/pages/CountriesDetailPage';
import { getCountryData } from 'actions/countries';

const mapStateToProps = (state, { params }) => ({
  iso: params.iso,
  countryData: state.countries.countriesData[params.iso] || false,
  countriesList: state.countries.countriesList
});

const mapDispatchToProps = dispatch => ({
  getCountryData: (iso) => dispatch(getCountryData(iso))
});

export default connect(mapStateToProps, mapDispatchToProps)(CountriesDetailPage);
