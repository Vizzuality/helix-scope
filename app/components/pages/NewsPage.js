import React from 'react';
import Footer from 'components/common/Footer';

export default () => {
  return (
    <div>
      <div className="l-banner -blank">
        <div className="l-wrap">
          <div className="c-breadcrumbs"><span>Home</span> / News</div>
          <div className="c-txt-title">Latest News</div>
          <div className="c-txt-intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent lacinia nisl in nisi tristique, et vestibulum metus semper.</div>
        </div>
      </div>
      <div className="l-page-content">
        <div className="c-txt-title -secondary">Archive</div>
        <div className="c-txt-body -large">
          Cras sodales, urna quis sagittis convallis, nisi sem aliquet velit, id finibus est lorem pretium nibh. Aliquam eget lacus eget arcu fermentum tempor ut sed tellus. Fusce blandit malesuada diam eget ullamcorper. Donec tempor dignissim lobortis. Morbi ut hendrerit libero. Aliquam erat volutpat. Integer turpis risus, pretium nec rutrum at, auctor a nibh. Ut ac lectus fringilla, venenatis orci condimentum, suscipit
        </div>
        <div className="c-txt-body">
          Cras sodales, urna quis sagittis convallis, nisi sem aliquet velit, id finibus est lorem pretium nibh. Aliquam eget lacus eget arcu fermentum tempor ut sed tellus. Fusce blandit malesuada diam eget ullamcorper. Donec tempor dignissim lobortis. Morbi ut hendrerit libero. Aliquam erat volutpat. Integer turpis risus, pretium nec rutrum at, auctor a nibh. Ut ac lectus fringilla, venenatis orci condimentum, suscipit
        </div>
      </div>
      <Footer className="l-footer"/>
    </div>
  );
};
