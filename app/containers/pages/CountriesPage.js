import { connect } from 'react-redux';
import CountriesPage from 'components/pages/CountriesPage';
import { setCountriesList } from 'actions/countriesConfig';

const mapStateToProps = state => ({
  countriesList: state.countriesConfig.countriesList
});

const mapDispatchToProps = dispatch => ({
  setCountriesList: data => dispatch(setCountriesList(data))
}
);

export default connect(mapStateToProps, mapDispatchToProps)(CountriesPage);
