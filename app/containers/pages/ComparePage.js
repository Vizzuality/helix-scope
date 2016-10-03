import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ComparePage from 'components/pages/ComparePage';

const mapStateToProps = state => ({
  countriesList: state.countries.countriesList
});

const mapDispatchToProps = dispatch => ({
  goToCompareDetail: (country1, country2) =>
    dispatch(push(`compare/${country1}/${country2}`))
});

export default connect(mapStateToProps, mapDispatchToProps)(ComparePage);
