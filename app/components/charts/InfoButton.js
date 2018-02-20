import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/common/Button';
import Tooltip from 'components/common/Tooltip';

function InfoButton(props) {
  return (
    <div className={cx('c-info', props.className)}>
      <Tooltip
        placement={props.tooltipPlacement}
        content={<p>{props.text}</p>}
      >
        {(tooltip) => (
          <Button icon="info" style={tooltip.open ? 'primary' : 'light'} size="small" />
        )}
      </Tooltip>
    </div>
  );
}

InfoButton.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
  tooltipPlacement: PropTypes.string
};

export default InfoButton;
