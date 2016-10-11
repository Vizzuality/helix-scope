import React from 'react';
import Footer from 'components/common/Footer';

export default function () {
  return (
    <div>
      <div className="l-main">
        <div className="row">
          <div className="column">
            <div className="c-txt-title">Partners</div>
            <div className="c-txt-intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia nisl in nisi tristique, et vestibulum metus semper.</div>
          </div>
        </div>
        <div className="l-disclaimer -dark">
          <div className="row align-middle">
            <div className="column shrink">
              <svg className="icon icon-logo -eu -light">
                <use xlinkHref="#eu-logo"></use>
              </svg>
            </div>
            <div className="column">
              <div className="c-txt-intro -inv -medium">This project has received funding from the European Union’s Seventh Framework Programme for research, technological development and demonstration under grant agreement no 603864.</div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-6 large-4">
            <a href="https://www.exeter.ac.uk/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo01.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.metoffice.gov.uk/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo02.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.tyndall.ac.uk/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo03.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="https://www.vu.nl/en/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo04.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://ec.europa.eu/dgs/jrc/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo05.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.wfp.org/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo06.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.ulg.ac.be/cms/c_5000/en/home" target="_blank">
              <img alt="Exeter" src="/images/partners/logo07.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.cnrs.fr/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo08.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.smhi.se/en" target="_blank">
              <img alt="Exeter" src="/images/partners/logo09.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="https://www.pik-potsdam.de/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo10.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.ucl.ac.uk/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo11.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.tuc.gr/3324.html" target="_blank">
              <img alt="Exeter" src="/images/partners/logo12.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.icpac.net/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo13.jpg" />
            </a>
          </div>
          <div className="column small-12 medium-6 large-4">
            <a href="http://www.buet.ac.bd/" target="_blank">
              <img alt="Exeter" src="/images/partners/logo14.jpg" />
            </a>
          </div>
        </div>
      </div>
      <Footer className="l-footer" />
    </div>
  );
}
