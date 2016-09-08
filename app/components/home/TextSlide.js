import React, { Component } from 'react';
import Button from 'components/common/Button';

class TextSlide extends Component {
  render() {
    let buttons = [];
    if (this.props.buttons) {
      this.props.buttons.forEach((btn, index) => {
        buttons.push(
          <Button
            key={index}
            icon="arrow"
            style="primary"
            size="large"
            link={btn.link}
            text={btn.text}
          />
        );
      });
    }

    return (
      <div>
        <div className="c-text-slide -center">
          <section className="content">
            <h2 className="title">{this.props.title}</h2>
            <p className="text">{this.props.content}</p>
            <div className="buttons">
              {buttons}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default TextSlide;

TextSlide.propTypes = {
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  buttons: React.PropTypes.array
};
