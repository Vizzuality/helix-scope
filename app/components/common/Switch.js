import React from 'react';

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
  options: React.PropTypes.array.isRequired,
  indexSelected: React.PropTypes.number.isRequired,
  onSwitch: React.PropTypes.func.isRequired
};

export default Switch;
