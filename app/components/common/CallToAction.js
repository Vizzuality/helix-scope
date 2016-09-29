import React from 'react';
import Button from 'components/common/Button';

function CallToAction(props) {
  let link;
  if (props.type === 'about') link = '/about';
  else if (props.type === 'partners') link = '/partners';
  else if (props.type === 'news') link = '/news';

  return (
    <div className={`c-call-to-action -${props.type}`}>
      <div className="row align-middle">
        <div className="column small-12 medium-8 medium-offset-2">
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
  type: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  content: React.PropTypes.string
};

export default CallToAction;
