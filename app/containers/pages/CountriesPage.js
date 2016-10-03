import { connect } from 'react-redux';
import CountriesPage from 'components/pages/CountriesPage';

const mapStateToProps = state => ({
  countriesList: state.countries.countriesList
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CountriesPage);
