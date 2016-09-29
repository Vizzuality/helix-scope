import React, { Component } from 'react';
import Button from 'components/common/Button';
import Legend from './Legend';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let deleteBtn;
    if (this.props.maps.length > 1) {
      deleteBtn = <Button onClick={() => this.props.deleteMap(this.props.mapData.id)} icon="close" style="light" size="small" />;
    }

    return (
      <div className="c-dashboard">
        <div className="dashboard-control">
          <div className="scenario">
            {this.props.mapData.scenario.name}
            <Button
              icon="settings" style="none" size="small"
              onClick={() => this.props.handleMapConfig(this.props.mapData.id)}
            />
          </div>
          {deleteBtn}
        </div>
        <div className="dashboard-legend">
          <h4>{this.props.mapData.category.name}</h4>
          <span>{this.props.mapData.indicator.name}</span>
          <Legend
            mapData={this.props.mapData}
          />
        </div>
      </div>
   );
  }
}

Dashboard.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    layer: React.PropTypes.string,
    scenario: React.PropTypes.object,
    category: React.PropTypes.object,
    indicator: React.PropTypes.object
  }).isRequired,
  deleteMap: React.PropTypes.func,
  handleMapConfig: React.PropTypes.func,
  maps: React.PropTypes.array
};

export default Dashboard;
