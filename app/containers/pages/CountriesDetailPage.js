import { connect } from 'react-redux';
import CountriesDetailPage from 'components/pages/CountriesDetailPage';
import { fetchCountryDetail } from 'actions/countries';

const mapStateToProps = (state, { params }) => ({
  configLoaded: !state.config.loading,
  iso: params.iso,
  countryData: state.countries.countriesData[params.iso] || false,
  countriesList: state.countries.countriesList
});

const mapDispatchToProps = dispatch => ({
  fetchCountryData: (iso) => dispatch(fetchCountryDetail(iso))
});

export default connect(mapStateToProps, mapDispatchToProps)(CountriesDetailPage);
