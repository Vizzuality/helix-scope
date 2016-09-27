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
      if (prop.slug === this.props.category) {
        categoryTitle = prop.title;
      }
    });

    let indicatorTitle;
    this.props.config.indicators.forEach(prop => {
      if (prop.slug === this.props.indicator) {
        indicatorTitle = prop.title;
      }
    });

    let scenarioTitle;
    if (this.props.config.scenarios.length > 0) {
      scenarioTitle = this.props.config.scenarios[this.props.scenario].title;
    }
    return { scenarioTitle, categoryTitle, indicatorTitle };
  }

  render() {
    const titles = this.setTitles();

    let deleteBtn;

    if (this.props.maps.length > 1) {
      deleteBtn = <Button onClick={() => this.props.deleteMap(this.props.id)} icon="close" style="light" size="small" />;
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
              onClick={() => this.props.handleMapConfig(this.props.id)}
            />
          </div>
          {deleteBtn}
        </div>
        <div className="dashboard-legend">
          <h4>{titles.categoryTitle}</h4>
          <span>{titles.indicatorTitle}</span>
          <div className="scale">
            <ul className="labels">
              {legendConfig[this.props.category].map((element, index) =>
                <li key={`legend-item-${index}`}>
                  <span style={{ backgroundColor: element.color }}></span>
                  {element.value}
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="dashboard-model">
          <label className="control control--checkbox">Climate
            <input type="checkbox" name="model" value="Model 1" />
            <div className="control--indicator"></div>
          </label>
          <label className="control control--checkbox">Biodiversity
            <input type="checkbox" name="model" value="Model 2" />
            <div className="control--indicator"></div>
          </label>
          <label className="control control--checkbox">Precipitation
            <input type="checkbox" name="model" value="Model 2" />
            <div className="control--indicator"></div>
          </label>
        </div>
      </div>
   );
  }
}

Dashboard.propTypes = {
  id: React.PropTypes.string,
  index: React.PropTypes.number,
  scenario: React.PropTypes.string,
  category: React.PropTypes.string,
  indicator: React.PropTypes.string,
  deleteMap: React.PropTypes.func,
  handleMapConfig: React.PropTypes.func,
  config: React.PropTypes.object,
  maps: React.PropTypes.array
};

export default Dashboard;
