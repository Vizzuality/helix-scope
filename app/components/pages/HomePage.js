import React, { Component } from 'react';
import HomeSlider from 'components/home/HomeSlider';
import FooterHome from 'components/common/FooterHome';

class HomePage extends Component {
  render() {
    return (
      <div>
        <HomeSlider {...this.props}/>
        <FooterHome/>
      </div>
    );
  }
}

export default HomePage;
