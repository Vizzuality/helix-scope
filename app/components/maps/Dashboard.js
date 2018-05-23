import React from 'react';
import PropTypes from 'prop-types';

import { metadataInfoText } from 'constants/map';
import Button from 'components/common/Button';
import InfoButton from 'components/charts/InfoButton';
import Legend from './Legend';

const Dashboard = (props) => {
  const deleteBtn = props.showDeleteBtn
        ? <Button onClick={() => props.deleteMap(props.mapData.id)} icon="close" style="light" size="small" />
        : null;
  const infoText = metadataInfoText[props.mapData.indicator.slug];

  return (
    <div className="c-dashboard">
      <div className="control">
        <div className="scenario">
          {props.mapData.scenario.name}
        </div>
        <Button
          icon="settings" style="none" size="small" position="right"
          onClick={() => props.handleMapConfig(props.mapData.id)}
        />
        <InfoButton
          tooltipPlacement="top"
          text={infoText}
        />
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
  mapData: PropTypes.shape({
    id: PropTypes.string,
    layer: PropTypes.object,
    scenario: PropTypes.object,
    category: PropTypes.object,
    indicator: PropTypes.object,
    measure: PropTypes.object
  }).isRequired,
  deleteMap: PropTypes.func,
  setMapState: PropTypes.func,
  handleMapConfig: PropTypes.func,
  showDeleteBtn: PropTypes.bool
};

export default Dashboard;
