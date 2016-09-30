import React from 'react';

function NewsCover(props) {
  return (
    <div className="c-news-cover">
      <div className="row align-middle">
        <div className="column small-12 large-8 large-offset-2">
          <div className="title">{props.title}</div>
          <div className="intro">{props.content}
          </div>
        </div>
      </div>
    </div>
  );
}

NewsCover.propTypes = {
  title: React.PropTypes.string.isRequired,
  content: React.PropTypes.string
};

export default NewsCover;
