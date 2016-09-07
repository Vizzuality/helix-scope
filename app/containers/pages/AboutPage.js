import { connect } from 'react-redux';
import AboutPage from 'components/pages/AboutPage';

import { setModal } from 'actions/modal';

const mapStateToProps = state => ({
  modalOpen: state.modal.open
});

const mapDispatchToProps = dispatch => ({
  setModal: status => {
    dispatch(setModal(status));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutPage);
