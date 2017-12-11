import React, { Component } from 'react';

class InfoButton extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      open: false
    };
  }

  onClick() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    return (
      <div className="c-info">
        <div className="icon" onClick={() => this.onClick()}>
          <svg width="10" height="10" viewBox="0 0 16 16">
            <title>Info</title>
            <path d="M12.307 16H3.693a1 1 0 0 1-.936-.649L0 8h16l-2.757 7.351a1 1 0 0 1-.936.649zM4 3l4 4 4-4h-2V0H6v3H4z" fillRule="evenodd" />
          </svg>
        </div>
        {this.state.open && <div className="infobox">
          {this.props.text}
        </div>}
      </div>
    );
  }
}

InfoButton.propTypes = {
  text: React.PropTypes.string
};

export default InfoButton;
