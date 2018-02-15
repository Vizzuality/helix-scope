import React from 'react';
import PropTypes from 'prop-types';

import Header from 'components/common/Header';
import ShareModal from 'components/modals/ShareModal';
import MenuModal from 'components/modals/MenuModal';

class ContainerPage extends React.Component {

  getChildContext() {
    const location = this.props.location;
    location.params = this.props.params;
    return { location };
  }

  isPageMiniHeader() {
    return this.props.location.pathname.indexOf('global-scenarios') > 0;
  }

  render() {
    return (
      <div>
        <Header
          mini={this.isPageMiniHeader()}
          setShareModal={this.props.setShareModal}
          setMenuModal={this.props.setMenuModal}
        />
          {this.props.children}
        <ShareModal
          title="Share"
          shareModalOpen={this.props.shareModalOpen}
          setShareModal={() => this.props.setShareModal(false)}
          shareUrl={window.location.href}
        />
        <MenuModal
          menuModalOpen={this.props.menuModalOpen}
          setShareModal={this.props.setShareModal}
          setMenuModal={() => this.props.setMenuModal(false)}
        />
      </div>
    );
  }
}

ContainerPage.childContextTypes = {
  location: PropTypes.object
};

ContainerPage.propTypes = {
  /**
  * Define required content for page
  **/
  children: PropTypes.element.isRequired,
  /**
  * Define whether page is loading or not
  **/
  loading: PropTypes.bool,
  /**
  * Callback to set modal open or closed
  **/
  setShareModal: PropTypes.func,
  /**
  * Callback to set modal open or closed
  **/
  setMenuModal: PropTypes.func,
  /**
  * Define whether modal is open or not
  **/
  menuModalOpen: PropTypes.bool,
  /**
  * Define whether modal is open or not
  **/
  shareModalOpen: PropTypes.bool,
  /**
  * Finds the route of current location in URL
  **/
  location: PropTypes.object,
  /**
  * Finds route pathname string for current location
  **/
  pathname: PropTypes.string,
  /**
  * Finds route params
  **/
  params: PropTypes.object
};

export default ContainerPage;
