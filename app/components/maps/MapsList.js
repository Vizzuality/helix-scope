import React from 'react';
import Map from './Map';
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
      {props.maps.map((map) =>
        <div className={`c-maps-list ${mapClasses[length - 1][map.id]}`} key={`map-${map.id}`}>
          <div className="scenario-wrapper">
            <Dashboard
              mapData={map}
              deleteMap={props.deleteMap}
              handleMapConfig={props.handleMapConfig}
            />
            <Map
              mapData={map}
              mapConfig={props.mapConfig}
              onMapDrag={props.onMapDrag}
              deleteMap={props.deleteMap}
              createLayer={props.createLayer}
            />
          </div>
        </div>
      )}
    </div>
  );
}

MapsList.propTypes = {
  maps: React.PropTypes.array,
  mapConfig: React.PropTypes.shape({
    latLng: React.PropTypes.object,
    zoom: React.PropTypes.number
  }).isRequired,
  onMapDrag: React.PropTypes.func,
  deleteMap: React.PropTypes.func,
  handleMapConfig: React.PropTypes.func,
  createLayer: React.PropTypes.func
};

export default MapsList;
