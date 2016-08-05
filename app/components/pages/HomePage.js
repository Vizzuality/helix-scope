import React, {Component} from 'react';
import HomeSlider from '../home/HomeSlider';
import FooterHome from '../common/FooterHome';

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
