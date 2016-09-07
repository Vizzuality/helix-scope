import React from 'react';
import Header from 'components/common/Header';
import ShareModal from 'components/modals/ShareModal';
import MenuModal from 'components/modals/MenuModal';

class ContainerPage extends React.Component {

  getChildContext() {
    const location = this.props.location;
    location.params = this.props.params;
    return {location};
  }

  render() {
    return (
      <div>
        <Header setShareModal={this.props.setShareModal} setMenuModal={this.props.setMenuModal}/>
        {this.props.children}
        <ShareModal shareModalOpen={this.props.shareModalOpen} setShareModal={() => this.props.setShareModal(false)} shareUrl={this.props.location.pathname} title="Share"/>
        <MenuModal menuModalOpen={this.props.menuModalOpen} setShareModal={this.props.setShareModal} setMenuModal={() => this.props.setMenuModal(false)}/>
      </div>
    );
  }
}

ContainerPage.childContextTypes = {
  location: React.PropTypes.object
};

ContainerPage.propTypes = {
  /**
  * Define required content for page
  **/
  children: React.PropTypes.element.isRequired,
  /**
  * Define whether page is loading or not
  **/
  loading: React.PropTypes.bool,
  /**
  * Callback to set modal open or closed
  **/
  setShareModal: React.PropTypes.func,
  /**
  * Callback to set modal open or closed
  **/
  setMenuModal: React.PropTypes.func,
  /**
  * Define whether modal is open or not
  **/
  menuModalOpen: React.PropTypes.bool,
  /**
  * Define whether modal is open or not
  **/
  shareModalOpen: React.PropTypes.bool,
  /**
  * Finds the route of current location in URL
  **/
  location: React.PropTypes.object,
  /**
  * Finds route pathname string for current location
  **/
  pathname: React.PropTypes.string
};

export default ContainerPage;
