import { connect } from 'react-redux';
import CountriesPage from 'components/pages/CountriesPage';
import { getCountriesList } from 'actions/countriesConfig';

const mapStateToProps = state => ({
  countriesList: state.countriesConfig.countriesList
});

const mapDispatchToProps = dispatch => ({
  getCountriesList: () => dispatch(getCountriesList())
}
);

export default connect(mapStateToProps, mapDispatchToProps)(CountriesPage);
