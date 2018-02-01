import React from 'react';
import { Link } from 'react-router';

const Button = (props) => {
  let btnText;
  if (props.text) {
    btnText = <span className={`btn-text -${props.color}`}>{props.text}</span>;
  }
  const icon = props.icon && (
    <svg className={`btn-icon icon-${props.icon} -${props.style} -size-${props.size}`}>
      <use xlinkHref={`#icon-${props.icon}`}></use>
    </svg>
  );
  if (props.link) {
    return (
      <Link to={props.link} className="c-btn btn-link">
        {icon}
        {btnText}
      </Link>
    );
  }
  return (
    <button className={`c-btn -${props.position}`} onClick={props.onClick}>
      {icon}
      {btnText}
    </button>
  );
};

export default Button;

Button.propTypes = {
  link: React.PropTypes.string,
  icon: React.PropTypes.string,
  style: React.PropTypes.string,
  text: React.PropTypes.string,
  size: React.PropTypes.string,
  onClick: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  position: React.PropTypes.string,
  color: React.PropTypes.string
};
