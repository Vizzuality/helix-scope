import { connect } from 'react-redux';
import CountriesDetailPage from 'components/pages/CountriesDetailPage';
import { getCountryData } from 'actions/countries';

const mapStateToProps = (state, { location, params }) => ({
  slug: params.slug,
  countryData: {}
});

const mapDispatchToProps = dispatch => ({
  getCountryData: (slug) => dispatch(getCountryData(slug))
}
);

export default connect(mapStateToProps, mapDispatchToProps)(CountriesDetailPage);
