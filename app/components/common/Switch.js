import React from 'react';
import PropTypes from 'prop-types';

function Switch(props) {
  return (
    <div className="c-switch">
      {props.options.map((option, index) => (
        <div
          key={index}
          onClick={() => props.onSwitch(index + 1)}
          className={`option ${index + 1 === props.indexSelected ? '-active' : ''}`}
        >
          {option}
        </div>
      ))}
    </div>
  );
}

Switch.propTypes = {
  options: PropTypes.array.isRequired,
  indexSelected: PropTypes.number.isRequired,
  onSwitch: PropTypes.func.isRequired
};

export default Switch;
