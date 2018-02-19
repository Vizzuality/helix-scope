import React from 'react';

function FooterHome() {
  return (
    <div className="row align-justify align-middle c-footer-home">
      <div className="column small-12 medium-2">
        <svg className="icon icon-logo -eu -light">
          <use xlinkHref="#eu-logo"></use>
        </svg>
      </div>
      <div className="column small-12 medium-8">
        <span className="text">
          HELIX has received funding from the European Union Seventh Framework Programme FP7/2007 - 2013 under grant agreement no 603864
        </span>
      </div>
      <div className="column small-12 medium-2">
        <img alt="Helix scope" src="images/helixLogo_negative.png" className="icon-logo" />
      </div>
    </div>
  );
}

export default FooterHome;
