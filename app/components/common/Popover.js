import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Popover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      open: !state.open
    }));
  }

  render() {
    const children = typeof this.props.children === 'function'
          ? this.props.children({ ...this.state })
          : this.props.children;

    return (
      <div className="c-popover-container" onClick={this.handleClick}>
        {children}
        {this.state.open &&
          <div className={`c-popover -${this.props.position}`}>
            {this.props.content}
          </div>
        }
      </div>
    );
  }
}

Popover.defaultProps = {
  position: 'left'
};

Popover.propTypes = {
  onCloseClick: PropTypes.func,
  children: PropTypes.any,
  position: PropTypes.string,
  content: PropTypes.any
};

export default Popover;
