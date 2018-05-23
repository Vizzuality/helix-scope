import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tippy from 'tippy.js';

class Tooltip extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  componentDidMount() {
    tippy(this.tooltipContainer, {
      arrow: true,
      theme: 'light',
      trigger: 'click',
      maxWidth: '500px',
      html: this.tooltipTemplate,
      placement: this.props.placement,
      onShow: () => this.setState({ open: true }),
      onHide: () => this.setState({ open: false })
    });
  }

  handleOnShow() {
    this.setState({ open: true });
  }

  handleOnHide() {
    this.setState({ open: false });
  }

  render() {
    const children = typeof this.props.children === 'function'
          ? this.props.children({ ...this.state })
          : this.props.children;

    return (
      <div>
        <div className="c-tooltip-container" ref={(ref) => { this.tooltipContainer = ref; }}>
          {children}
        </div>
        <div ref={(ref) => { this.tooltipTemplate = ref; }}>
          {this.props.content}
        </div>
      </div>
    );
  }
}

Tooltip.defaultProps = {
  placement: 'top'
};

Tooltip.propTypes = {
  children: PropTypes.any,
  placement: PropTypes.string,
  content: PropTypes.any
};

export default Tooltip;
