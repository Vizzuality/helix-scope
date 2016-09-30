import { connect } from 'react-redux';
import ContainerPage from 'components/pages/ContainerPage';

import { setShareModal, setMenuModal } from 'actions/modal';

const mapStateToProps = (state, location) => ({
  path: location.location.pathname,
  loading: state.config.loading,
  shareModalOpen: state.modal.shareModalOpen,
  menuModalOpen: state.modal.menuModalOpen
});

const mapDispatchToProps = dispatch => ({
  setShareModal: status => {
    dispatch(setShareModal(status));
  },
  setMenuModal: status => {
    dispatch(setMenuModal(status));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContainerPage);
