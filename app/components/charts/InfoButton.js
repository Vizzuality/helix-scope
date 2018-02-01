import React, { Component } from 'react';
import Button from 'components/common/Button';

class InfoButton extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      open: false
    };

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
        <Button style="none" size="small" onClick={this.handleClick} text="i" />
        {this.state.open && <div className="infobox">
          <p>{this.props.text}</p>
        </div>}
      </div>
    );
  }
}

InfoButton.propTypes = {
  text: React.PropTypes.string
};

export default InfoButton;
