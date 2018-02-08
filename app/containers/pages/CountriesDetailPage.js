import { connect } from 'react-redux';
import CountriesDetailPage from 'components/pages/CountriesDetailPage';
import { fetchCountryDetail } from 'actions/countries';
import { fetchBoxAndWhiskers } from 'actions/charts';

const mapStateToProps = (state, { params }) => ({
  config: state.config,
  iso: params.iso,
  countryData: state.countries.countriesData[params.iso] || false,
  countriesList: state.countries.countriesList
});

const mapDispatchToProps = {
  fetchCountryData: fetchCountryDetail,
  fetchBoxAndWhiskers
};

export default connect(mapStateToProps, mapDispatchToProps)(CountriesDetailPage);
