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
      {props.maps.map((map, index) =>
        <div className={`c-maps-list ${mapClasses[length - 1][index]}`} key={`map-${index}`}>
          <div className="scenario-wrapper">
            <Dashboard
              id={`${index}`}
              scenario={map.scenario}
              category={map.category}
              indicator={map.indicator}
              maps={props.maps}
              deleteMap={props.deleteMap}
              handleMapConfig={props.handleMapConfig}
            />
            <Map
              id={`${index}`}
              scenario={map.scenario}
              category={map.category}
              indicator={map.indicator}
              latLng={props.latLng}
              zoom={props.zoom}
              onMapDrag={props.onMapDrag}
              maps={props.maps}
              deleteMap={props.deleteMap}
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
  latLng: React.PropTypes.object,
  zoom: React.PropTypes.number,
  onMapDrag: React.PropTypes.func,
  deleteMap: React.PropTypes.func,
  handleMapConfig: React.PropTypes.func
};

export default MapsList;
