import React from 'react';
import Map from 'containers/maps/Map';
import Dashboard from 'containers/maps/DashboardContainer';

function MapsList(props) {
  const numMaps = props.maps.length;
  const mapClasses = [
    ['-full'],
    ['-horizontal', '-horizontal'],
    ['-wide', '-wide', '-narrow'],
    ['-quarter', '-quarter', '-quarter', '-quarter']
  ];

  return (
    <div className="l-maps-container">
      {props.maps.map((map, index) =>
        <div className={`c-maps-list ${mapClasses[numMaps - 1][index]}`} key={`map-${index}`}>
          <div className="scenario-wrapper">
            <Dashboard
              mapData={map}
              handleMapConfig={props.handleMapConfig}
            />
            <Map
              mapData={map}
            />
          </div>
        </div>
      )}
    </div>
  );
}

MapsList.propTypes = {
  maps: React.PropTypes.array,
  handleMapConfig: React.PropTypes.func
};

export default MapsList;
