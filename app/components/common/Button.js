import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router';

const Button = (props) => {
  let btnText;
  if (props.text) {
    btnText = <span className={cx('btn-text', { [`-${props.color}`]: !!props.color })}>{props.text}</span>;
  }
  const iconClassName = cx({
    'btn-icon': true,
    [`icon-${props.icon}`]: !!props.icon,
    [`-${props.style}`]: !!props.style,
    [`-size-${props.size}`]: !!props.size
  });
  const icon = props.icon && (
    <svg className={iconClassName}>
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
    <button className={cx('c-btn', { [`-${props.position}`]: !!props.position })} onClick={props.onClick}>
      {icon}
      {btnText}
    </button>
  );
};

export default Button;

Button.propTypes = {
  link: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  position: PropTypes.string,
  color: PropTypes.string
};
