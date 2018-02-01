import React from 'react';
import Button from 'components/common/Button';
import Legend from './Legend';
import MeasureSelector from './MeasureSelector';

const Dashboard = (props) => {
  const deleteBtn = props.showDeleteBtn ?
    <Button onClick={() => props.deleteMap(props.mapData.id)} icon="close" style="light" size="small" /> :
    null;

  const measurements = props.mapData.indicator.measurements
    .map((measurement) => props.config.measurements.find((m) => m.slug === measurement));
  const handleMeasureChange = (measure) => {
    props.setMapState({ ...props.mapData, measure });
  };

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
      <div className="measure">
        <MeasureSelector
          measure={props.mapData.measure}
          measurements={measurements}
          onChange={handleMeasureChange}
        />
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
  showDeleteBtn: React.PropTypes.bool,
  config: React.PropTypes.shape({
    measurements: React.PropTypes.array
  }).isRequired
};

export default Dashboard;
