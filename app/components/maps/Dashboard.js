import React, { Component } from 'react';
import Button from 'components/common/Button';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.setTitles = this.setTitles.bind(this);
  }

  setTitles() {
    let categoryTitle;
    this.props.config.categories.forEach(prop => {
      if (prop.slug === this.props.mapData.category) {
        categoryTitle = prop.name;
      }
    });

    const filteredIndicators = this.props.config.categories.find((elem) => (
      elem.name === this.props.mapData.category
    ));
    let activeIndicators = [];
    if (filteredIndicators && filteredIndicators.indicator) {
      activeIndicators = filteredIndicators.indicator;
    }

    let indicatorTitle;
    activeIndicators.forEach(prop => {
      if (prop.slug === this.props.mapData.indicator) {
        indicatorTitle = prop.name;
      }
    });

    let scenarioTitle;
    if (this.props.config.scenarios.length > 0) {
      const scenary = this.props.config.scenarios.find((elem) => (
        elem.slug === this.props.mapData.scenario
      ));
      if (scenary) {
        scenarioTitle = scenary.name;
      }
    }
    return { scenarioTitle, categoryTitle, indicatorTitle };
  }

  render() {
    const titles = this.setTitles();

    let deleteBtn;

    if (this.props.maps.length > 1) {
      deleteBtn = <Button onClick={() => this.props.deleteMap(this.props.mapData.id)} icon="close" style="light" size="small" />;
    }

    const legendConfig = {
      climate: [{ color: '#d6faec', value: 0 },
                { color: '#cff1e1', value: 0.2 },
                { color: '#dde133', value: 0.4 },
                { color: '#e5cf19', value: 0.6 },
                { color: '#a4c504', value: 0.8 },
                { color: '#268434', value: 1 }],
      biodiversity: [{ color: '#d2ecfb', value: 0 },
                { color: '#b3ecdd', value: 0.2 },
                { color: '#5faacf', value: 0.4 },
                { color: '#4084cd', value: 0.6 },
                { color: '#4963b8', value: 0.8 },
                { color: '#383e9c', value: 1 }]
    };

    return (
      <div className="c-dashboard">
        <div className="dashboard-control">
          <div className="scenario">
            {titles.scenarioTitle}
            <Button
              icon="settings" style="none" size="small"
              onClick={() => this.props.handleMapConfig(this.props.mapData.id)}
            />
          </div>
          {deleteBtn}
        </div>
        <div className="dashboard-legend">
          <h4>{titles.categoryTitle}</h4>
          <span>{titles.indicatorTitle}</span>
          <div className="scale">
            <ul className="labels">
              {legendConfig[this.props.mapData.category].map((element, index) =>
                <li key={`legend-item-${index}`}>
                  <span style={{ backgroundColor: element.color }}></span>
                  {element.value}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
   );
  }
}

Dashboard.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    layer: React.PropTypes.string,
    scenario: React.PropTypes.string,
    category: React.PropTypes.string,
    indicator: React.PropTypes.string
  }).isRequired,
  deleteMap: React.PropTypes.func,
  handleMapConfig: React.PropTypes.func,
  config: React.PropTypes.object,
  maps: React.PropTypes.array
};

export default Dashboard;
