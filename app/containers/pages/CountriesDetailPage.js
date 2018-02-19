import { connect } from 'react-redux';
import CountriesDetailPage from 'components/pages/CountriesDetailPage';
import { fetchBoxAndWhiskers } from 'actions/charts';

const mapStateToProps = (state, { params }) => ({
  config: state.config,
  iso: params.iso,
  countriesList: state.countries.countriesList
});

const mapDispatchToProps = {
  fetchBoxAndWhiskers
};

export default connect(mapStateToProps, mapDispatchToProps)(CountriesDetailPage);
