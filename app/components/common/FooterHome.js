import React from 'react';

function FooterHome() {
  return (
    <div className="l-footer-home">
      <div className="row align-justify align-middle c-footer-home">
        <div className="column shrink">
          <svg className="icon icon-logo -light">
            <use xlinkHref="#eu-logo"></use>
          </svg>
        </div>
        <div className="column text-container">
          <span className="text">HELIX has received funding from the European Union Seventh Framework Programme FP7/2007 - 2013 under grant agreement no 603864</span>
          <img alt="Helix scope" src="images/helixLogo_negative.png" className="icon-logo" />
        </div>
      </div>
    </div>
  );
}

export default FooterHome;
