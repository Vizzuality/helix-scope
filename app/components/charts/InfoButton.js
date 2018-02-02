import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import Button from 'components/common/Button';
import uuid from 'uuid/v4';

class InfoButton extends Component {
  constructor(...args) {
    super(...args);
    this.state = { open: false };

    this.handleAfterHide = this.handleAfterHide.bind(this);
    this.handleAfterShow = this.handleAfterShow.bind(this);
  }

  handleAfterShow() {
    this.setState({ open: true });
  }

  handleAfterHide() {
    this.setState({ open: false });
  }

  render() {
    const id = uuid();

    return (
      <div className="c-info">
        <div data-tip="custom show" data-for={id} data-event="click">
          <Button icon="info" style={this.state.open ? 'primary' : 'dark'} size="medium" />
        </div>
        <ReactTooltip
          border
          className="info-tooltip"
          id={id}
          placement="left"
          effect="solid"
          afterHide={this.handleAfterHide}
          afterShow={this.handleAfterShow}
        >
          <p>{this.props.text}</p>
        </ReactTooltip>
      </div>
    );
  }
}

InfoButton.propTypes = {
  text: React.PropTypes.string
};

export default InfoButton;
