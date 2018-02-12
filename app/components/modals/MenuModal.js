import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/common/Modal';
import Button from 'components/common/Button';
import NavLink from 'components/common/NavLink';

class MenuModal extends Component {
  handleShareOpen() {
    this.props.setShareModal(true);
    this.props.setMenuModal(false);
  }
  render() {
    return (
      <div>
        <Modal
          className="menu"
          modalOpen={this.props.menuModalOpen}
          onSetModal={this.props.setMenuModal}
          btnStyle="primary"
        >
          <ul className="mobile-menu">
            <li>
              <NavLink to="/global-scenarios" className="-green" onClick={() => this.props.setMenuModal(false)}>Global Scenarios</NavLink>
            </li>
            <li>
              <NavLink to="/countries" className="-orange" onClick={() => this.props.setMenuModal(false)}>Countries</NavLink>
            </li>
            <li>
              <NavLink to="/compare" className="-red" onClick={() => this.props.setMenuModal(false)}>Compare</NavLink>
            </li>
            <li>
              <Button icon="share" style="none" size="small" onClick={() => this.handleShareOpen} />
            </li>
          </ul>
        </Modal>
      </div>
    );
  }
}

MenuModal.propTypes = {
  /**
  * Define whether modal is open or not
  **/
  menuModalOpen: PropTypes.bool,
  /**
  * Callback when closing or opening modal
  **/
  setMenuModal: PropTypes.func,
  /**
  * Callback when closing or opening modal
  **/
  setShareModal: PropTypes.func,
  /**
  * Title for Modal component
  **/
  title: PropTypes.string,
  /**
  * Route of current location
  **/
  shareUrl: PropTypes.string
};

export default MenuModal;
