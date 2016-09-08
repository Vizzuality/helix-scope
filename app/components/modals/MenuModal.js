import React, { Component } from 'react';
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
              <Button icon="share" style="none" size="small" onClick={this.handleShareOpen.bind(this)}/>
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
  menuModalOpen: React.PropTypes.bool,
  /**
  * Callback when closing or opening modal
  **/
  setMenuModal: React.PropTypes.func,
  /**
  * Callback when closing or opening modal
  **/
  setShareModal: React.PropTypes.func,
  /**
  * Title for Modal component
  **/
  title: React.PropTypes.string,
  /**
  * Route of current location
  **/
  shareUrl: React.PropTypes.string
};

export default MenuModal;
