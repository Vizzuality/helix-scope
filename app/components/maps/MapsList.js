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
        <div className={`c-maps-list ${mapClasses[numMaps - 1][index]}`} key={`map-${map.id}`}>
          <div className="scenario-wrapper">
            <Dashboard
              mapData={map}
              handleMapConfig={props.handleMapConfig}
            />
            <Map
              mapData={map}
              createLayer={props.createLayer}
              getMapBuckets={props.getMapBuckets}
            />
          </div>
        </div>
      )}
    </div>
  );
}

MapsList.propTypes = {
  maps: React.PropTypes.array,
  handleMapConfig: React.PropTypes.func,
  mapConfig: React.PropTypes.shape({
    latLng: React.PropTypes.object,
    zoom: React.PropTypes.number
  }).isRequired,
  onMapDrag: React.PropTypes.func,
  deleteMap: React.PropTypes.func,
  createLayer: React.PropTypes.func,
  getMapBuckets: React.PropTypes.func
};

export default MapsList;
