import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import get from 'lodash/get';

import { getChartsByCategory } from 'utils/charts';
import { categoriesOrder } from 'constants/country';
import DisplayCharts from 'containers/charts/DisplayCharts';
import CallToAction from 'components/common/CallToAction';
import ExploreScenarios from 'components/common/ExploreScenarios';
import Footer from 'components/common/Footer';
import LoadingSpinner from 'components/common/LoadingSpinner';

class CountriesDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChartByCategory: {}
    };
  }

  setSelectedChartByCategory(category, property, value) {
    this.setState((state) => ({
      selectedChartByCategory: {
        ...state.selectedChartByCategory,
        [category.slug]: {
          ...state.selectedChartByCategory[category.slug],
          [property]: value
        }
      }
    }));
  }

  handleChartChange(category, chart) {
    this.setSelectedChartByCategory(category, 'chart', chart);
  }

  handleMeasureChange(category, measure) {
    this.setSelectedChartByCategory(category, 'measure', measure);
  }

  render() {
    if (this.props.config.loading) return <LoadingSpinner />;

    const country = this.props.countriesList && this.props.countriesList.find((c) => c.iso === this.props.iso);
    const categories = [...this.props.config.categories].sort(
      (a, b) => categoriesOrder.indexOf(a.slug) > categoriesOrder.indexOf(b.slug)
    );

    if (!country) return null;

    return (
      <div>
        <div className="l-banner -country">
          <div className="row">
            <div className="column">
              <div className="c-breadcrumbs -inv"><Link to="/countries"> &lt; Select a new country </Link> </div>
              <div className="c-txt-title -inv">{country.name}</div>
            </div>
          </div>
        </div>
        <div className="l-page-content">
          {categories.map((category, index) => (
            <div className="c-country-page-chart" key={index}>
              <div className="row">
                <div className="column">
                  <h2>{category.name}</h2>
                </div>
              </div>
              <div className="row">
                <div className="column small-12">
                  <DisplayCharts
                    country={country}
                    charts={getChartsByCategory(category)}
                    selectedChart={get(this.state.selectedChartByCategory[category.slug], 'chart')}
                    selectedMeasure={get(this.state.selectedChartByCategory[category.slug], 'measure')}
                    onChartChange={(chart) => this.handleChartChange(category, chart)}
                    onMeasureChange={(measure) => this.handleMeasureChange(category, measure)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <CallToAction
          type="about"
          title="About the project"
          content="Helixscope is designed to show some of the results from the Helix project. It is designed to show how impacts change under different levels of warming at 2°C, 4°C and 6°C of global warming (specific warming levels of SWLs). It allows the user to look at impacts and climate change at a country level, and to compare different impacts."
        />
        <div className="l-page-modules">
          <ExploreScenarios />
        </div>
        <Footer className="l-footer" />
      </div>
    );
  }
}

CountriesDetailPage.propTypes = {
  config: PropTypes.object.isRequired,
  fetchBoxAndWhiskers: PropTypes.func.isRequired,
  countriesList: PropTypes.array,
  iso: PropTypes.string
};

export default CountriesDetailPage;
