import React from 'react';
import Button from 'components/common/Button';

class GetUpdates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailEmpty: false,
      subscribed: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  handleChange(e) {
    this.setState({
      email: e.target.value,
      emailEmpty: false
    });
  }

  subscribe() {
    if (this.state.email && this.isValidEmail(this.state.email)) {
      this.setState({
        subscribed: true
      });
    } else if (!this.state.emailEmpty) {
      this.setState({
        emailEmpty: true
      });
    }
  }

  isValidEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  render() {
    return (
      <div className={`l-module ${this.state.subscribed ? '-success' : ''}`}>
        <div className={`row align-justify align-middle c-get-updates ${this.state.subscribed ? '-success' : ''}`}>
          <div className="column">
            <span>Get Updates</span>
          </div>
          <div className="column">
            <input
              className={`${this.state.emailEmpty ? '-error' : ''}`}
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="Enter email address"
            />
          </div>
          <div className="column">
            {this.state.subscribed
              ? <Button
                icon="success"
                style="success"
                size="large"
              />
              : <Button
                icon="arrow"
                style="primary"
                size="large"
                onClick={this.subscribe}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default GetUpdates;
