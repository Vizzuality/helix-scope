import React from 'react';
import PropTypes from 'prop-types';

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
  onCloseClick: PropTypes.func,
  children: PropTypes.any,
  title: PropTypes.string
};

export default Popup;
