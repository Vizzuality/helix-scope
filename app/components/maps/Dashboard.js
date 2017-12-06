import React from 'react';
import Button from 'components/common/Button';
import Legend from './Legend';
import MeasureSelector from './MeasureSelector';

function Dashboard(props) {
  let deleteBtn = props.maps.length > 1 ?
    <Button onClick={() => props.deleteMap(props.mapData.id)} icon="close" style="light" size="small" /> :
    null;

  let measurements = props.mapData.indicator.measurements
    .map((measurement) => props.config.measurements.find((m) => m.slug === measurement));

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
        <span>{props.mapData.indicator.name} ({props.mapData.indicator.unit})</span>
        <Legend mapData={props.mapData} />
      </div>
      <div className="measure">
        <MeasureSelector
          mapData={props.mapData}
          measurements={measurements}
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
