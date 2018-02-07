import React from 'react';
import Button from 'components/common/Button';
import Legend from './Legend';

const Dashboard = (props) => {
  const deleteBtn = props.showDeleteBtn ?
    <Button onClick={() => props.deleteMap(props.mapData.id)} icon="close" style="light" size="small" /> :
    null;

  return (
    <div className="c-dashboard">
      <div className="control">
        <div className="scenario">
          {props.mapData.scenario.name}
          <Button
            icon="settings" style="none" size="small" position="right"
            onClick={() => props.handleMapConfig(props.mapData.id)}
          />
        </div>
        {deleteBtn}
      </div>
      <div className="legend">
        <h4>{props.mapData.category.name}</h4>
        <span>{props.mapData.indicator.name} ({props.mapData.indicator.unit})</span>
        <Legend mapData={props.mapData} />
      </div>
    </div>
 );
};

Dashboard.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    layer: React.PropTypes.object,
    scenario: React.PropTypes.object,
    category: React.PropTypes.object,
    indicator: React.PropTypes.object,
    measure: React.PropTypes.object
  }).isRequired,
  deleteMap: React.PropTypes.func,
  setMapState: React.PropTypes.func,
  handleMapConfig: React.PropTypes.func,
  showDeleteBtn: React.PropTypes.bool
};

export default Dashboard;
