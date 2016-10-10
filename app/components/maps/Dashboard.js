import React from 'react';
import Button from 'components/common/Button';
import Legend from './Legend';
import MeasureSelector from './MeasureSelector';
import SeasonSelector from './SeasonSelector';

function Dashboard(props) {
  let deleteBtn;
  if (props.maps.length > 1) {
    deleteBtn = <Button onClick={() => props.deleteMap(props.mapData.id)} icon="close" style="light" size="small" />;
  }

  return (
    <div className="c-dashboard">
      <div className="control">
        <div className="scenario">
          {props.mapData.scenario.name}
          <Button
            icon="settings" style="none" size="small"
            onClick={() => props.handleMapConfig(props.mapData.id)}
          />
        </div>
        {deleteBtn}
      </div>
      <div className="legend">
        <h4>{props.mapData.category.name}</h4>
        <span>{props.mapData.indicator.name} ({props.mapData.indicator.units})</span>
        <Legend
          mapData={props.mapData}
        />
      </div>
      <div className="measure">
        <MeasureSelector
          mapData={props.mapData}
          measurements={props.config.measurements}
          setMapState={props.setMapState}
        />
      </div>
      <div className="season">
        <SeasonSelector
          mapData={props.mapData}
          setMapState={props.setMapState}
        />
      </div>
    </div>
 );
}

Dashboard.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    layer: React.PropTypes.object,
    scenario: React.PropTypes.object,
    category: React.PropTypes.object,
    indicator: React.PropTypes.object
  }).isRequired,
  deleteMap: React.PropTypes.func,
  setMapState: React.PropTypes.func,
  handleMapConfig: React.PropTypes.func,
  maps: React.PropTypes.array,
  config: React.PropTypes.shape({
    measurements: React.PropTypes.array
  }).isRequired
};

export default Dashboard;
