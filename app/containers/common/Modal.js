import { connect } from 'react-redux';
import Modal from 'components/common/Modal';

import { setModal } from 'actions/modal';

const mapStateToProps = state => ({
  modalOpen: state.modal.modalOpen
});

const mapDispatchToProps = dispatch => ({
  setModal: status =>
    dispatch(setModal(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
