import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/common/Button';
import FooterHome from 'components/common/FooterHome';

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
    <div className="l-slides">
      <div className="row align-middle">
        <div className="column c-text-slide -center">
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
      <FooterHome />
    </div>
  );
}

export default TextSlide;

TextSlide.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  buttons: PropTypes.array,
  children: PropTypes.any
};
