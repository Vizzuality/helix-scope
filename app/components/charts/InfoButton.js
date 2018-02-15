import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/common/Button';

class InfoButton extends Component {
  constructor(...args) {
    super(...args);
    this.state = { open: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      open: !state.open
    }));
  }

  render() {
    return (
      <div className="c-info">
        <Button icon="info" style={this.state.open ? 'primary' : 'light'} size="small" onClick={this.handleClick} />
        {this.state.open && <div className="infobox">
          <p>{this.props.text}</p>
        </div>}
      </div>
    );
  }
}

InfoButton.propTypes = {
  text: PropTypes.string
};

export default InfoButton;
