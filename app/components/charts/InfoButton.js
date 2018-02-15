import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/common/Button';
import Popover from 'components/common/Popover';

function InfoButton(props) {
  return (
    <div className={cx('c-info', props.className)}>
      <Popover
        position={props.popoverPosition}
        content={<p>{props.text}</p>}
      >
        {(popover) => (
          <Button icon="info" style={popover.open ? 'primary' : 'light'} size="small" />
        )}
      </Popover>
    </div>
  );
}

InfoButton.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  popoverPosition: PropTypes.string
};

export default InfoButton;
