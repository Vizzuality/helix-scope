import React from 'react';
import Map from 'containers/maps/Map';
import Dashboard from 'containers/maps/DashboardContainer';

function MapsList(props) {
  const length = props.maps.length;
  const mapClasses = [
    ['-full'],
    ['-horizontal', '-horizontal'],
    ['-wide', '-wide', '-narrow'],
    ['-quarter', '-quarter', '-quarter', '-quarter']
  ];

  return (
    <div className="l-maps-container">
      {props.maps.map((map, index) =>
        <div className={`c-maps-list ${mapClasses[length - 1][index]}`} key={`map-${index}`}>
          <div className="scenario-wrapper">
            <Dashboard
              id={`${index}`}
              scenario={map.scenario}
              category={map.category}
              indicator={map.indicator}
              handleMapConfig={props.handleMapConfig}
            />
            <Map
              id={`${index}`}
              scenario={map.scenario}
              category={map.category}
              indicator={map.indicator}
            />
          </div>
        </div>
      )}
    </div>
  );
}

MapsList.contextTypes = {
  location: React.PropTypes.object
};

MapsList.propTypes = {
  maps: React.PropTypes.array,
  handleMapConfig: React.PropTypes.func
};

export default MapsList;
