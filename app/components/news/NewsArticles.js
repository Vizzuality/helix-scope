import React from 'react';
import PropTypes from 'prop-types';

function NewsArticles(props) {
  return (
    <div className="row">
      {props.articles.map((article, index) => (
        <div className="column small-12 large-4 c-news-article" key={index}>
          <h3><a href="#">{article.title}</a></h3>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
}

NewsArticles.propTypes = {
  articles: PropTypes.array
};

export default NewsArticles;
