import React, { Component } from 'react';
import Button from 'components/common/Button';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleClickModal = this.handleClickModal.bind(this);
  }
  handleClickModal(e) {
    if (e.target === e.currentTarget) {
      this.props.onSetModal();
    }
  }

  render() {
    if (!this.props.modalOpen) {
      return null;
    }
    return (
      <div className={`overlay ${this.props.className}`} onClick={this.handleClickModal}>
        <div className={`c-modal c-${this.props.className}-modal`}>
          <Button
            onClick={() => this.props.onSetModal(false)}
            icon="close"
            style={this.props.btnStyle}
            size="medium"
            position="right-abs"
          />
          {this.props.children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  /**
  * Define required content of modal
  **/
  children: React.PropTypes.any,
  /**
  * Define whether modal is open or not
  **/
  modalOpen: React.PropTypes.bool,
  /**
  * Callback to set modal open or closed
  **/
  onSetModal: React.PropTypes.func,
  /**
  * Define classname for modal (share, map, mobile menu)
  **/
  className: React.PropTypes.string,
  /**
  * Define title for modal
  **/
  title: React.PropTypes.string,
  /**
  * Define btn colour for close modal
  **/
  btnStyle: React.PropTypes.string
};

export default Modal;
