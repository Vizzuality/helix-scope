import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/common/Button';

function CallToAction(props) {
  let link;
  if (props.type === 'about') link = '/about';
  else if (props.type === 'partners') link = '/partners';
  else if (props.type === 'news') link = '/news';

  return (
    <div className={`c-call-to-action -${props.type}`}>
      <div className="row align-middle">
        <div className="column small-12 large-8 large-offset-2">
          <div className="c-txt-title -inv -huge">{props.title}</div>
          <div className="c-txt-intro -inv">{props.content}
          </div>
          <div>
            <Button
              icon="arrow"
              style="primary"
              size="large"
              link={link}
              text="FIND OUT MORE"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

CallToAction.propTypes = {
  /*
    Define the link, the background img it have 3 types:
    - about
    - news
    - about
  */
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string
};

export default CallToAction;
