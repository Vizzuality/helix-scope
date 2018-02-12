import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/common/Button';
import Modal from 'components/common/Modal';

class ShareModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyFailed: false,
      copied: false
    };
    this.handleCopyClick = this.handleCopyClick.bind(this);
  }

  handleCopyClick() {
    try {
      this.url.select();
      const isEnabled = document.queryCommandEnabled('copy');
      const successful = document.execCommand('copy');

      if (isEnabled && successful) {
        this.setState({
          copied: true
        });
      } else {
        this.setState({
          copyFailed: true
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    let copyText;
    if (this.state.copyFailed) {
      copyText = 'Now press ⌘ + C to copy';
    }
    let btnText;
    if (this.state.copied) {
      btnText = 'copied';
    } else {
      btnText = 'copy';
    }
    return (
      <div>
        <Modal
          className="share"
          modalOpen={this.props.shareModalOpen}
          onSetModal={this.props.setShareModal}
          btnStyle="dark"
        >
          <div className="title">
            Share
          </div>
          <div className="text">
            Copy this URL to Share
          </div>
          <div className="actions">
            <input ref={ref => (this.url = ref)} defaultValue={this.props.shareUrl} className="c-input url" />
            <Button
              onClick={this.handleCopyClick}
              icon="arrow"
              style="primary"
              size="large"
              text={btnText}
              color="dark"
              position="copy-link"
            />
          </div>
          <div className="copy-text">
            {copyText}
          </div>
          <div className="share-links">
            <a
              href={`http://www.facebook.com/sharer/sharer.php?u=${this.props.shareUrl}`}
              className="c-btn btn-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className={'btn-icon icon-facebook -none -size-small'}>
                <use xlinkHref={'#icon-facebook'}></use>
              </svg>
            </a>
            <a
              href={`https://twitter.com/share?url=${this.props.shareUrl}`}
              className="c-btn btn-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className={'btn-icon icon-twitter -none -size-small'}>
                <use xlinkHref={'#icon-twitter'}></use>
              </svg>
            </a>
          </div>
        </Modal>
      </div>
    );
  }
}

ShareModal.propTypes = {
  /**
  * Define whether modal is open or not
  **/
  shareModalOpen: PropTypes.bool,
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

export default ShareModal;
