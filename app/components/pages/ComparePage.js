import React from 'react';
import CompareSelects from 'containers/common/CompareSelects';
import ExploreScenarios from 'components/common/ExploreScenarios';
import Footer from 'components/common/Footer';

function ComparePage() {
  return (
    <div>
      <div className="l-banner-large -compare">
        <div className="row">
          <div className="column">
            <div className="c-txt-title -inv">Compare</div>
            <div className="c-txt-intro -inv">Climate change will affect different places in different ways. Choose the countries or territories you are interested in and explore the impacts at 1.5°C, 2°C and 4°C.</div>
          </div>
        </div>
        <CompareSelects inline />
      </div>
      <Footer className="l-footer" />
    </div>
  );
}

export default ComparePage;
