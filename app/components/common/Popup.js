import React from 'react';

import Button from 'components/common/Button';

const Popup = (props) => {
  return (
    <div className="c-popup">
      <div className="header">
        {props.title}
        <Button icon="close" style="none" size="small" position="right" />
      </div>
      <div className="content">
        {props.children}
      </div>
    </div>
  );
};

Popup.propTypes = {
  children: React.PropTypes.any,
  title: React.PropTypes.string
};

export default Popup;
