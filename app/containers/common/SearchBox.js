import { connect } from 'react-redux';
import SearchBox from 'components/common/SearchBox';

import { goToCountry } from 'actions/countries';

const mapDispatchToProps = dispatch => ({
  goToCountry: status =>
    dispatch(goToCountry(status))
});

export default connect(null, mapDispatchToProps)(SearchBox);
