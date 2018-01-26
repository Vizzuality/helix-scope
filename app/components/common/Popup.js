import React from 'react';

import Button from 'components/common/Button';

const Popup = (props) => (
  <div className="c-popup">
    <div className="header">
      {props.title}
      <Button icon="close" style="primary" size="small" position="right" onClick={props.onCloseClick} />
    </div>
    <div className="content">
      {props.children}
    </div>
  </div>
);

Popup.propTypes = {
  onCloseClick: React.PropTypes.func,
  children: React.PropTypes.any,
  title: React.PropTypes.string
};

export default Popup;
