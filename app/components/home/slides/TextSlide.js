import React from 'react';
import Button from 'components/common/Button';

function TextSlide(props) {
  let buttons = [];
  if (props.buttons) {
    props.buttons.forEach((btn, index) => {
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
          <h2 className="title">{props.title}</h2>
          <p className="text">{props.content}</p>
          <div className="buttons">
            {buttons}
          </div>
          <div className="actions">
            {props.children}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TextSlide;

TextSlide.propTypes = {
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  buttons: React.PropTypes.array,
  children: React.PropTypes.any
};
