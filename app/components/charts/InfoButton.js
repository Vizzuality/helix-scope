import React, { Component } from 'react';
import cx from 'classnames';

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
        <div className={cx("icon", {"active": this.state.open})} onClick={() => this.onClick()}>
          <svg width="10" height="10" viewBox="0 0 16 16">
            <title>Info</title>
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
