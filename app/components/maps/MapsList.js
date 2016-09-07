import React, { Component } from 'react';
import Map from './Map';

class MapsList extends Component {
  render() {
    const length = this.props.maps.length;
    const mapClasses = [
      ['-full'],
      ['-horizontal', '-horizontal'],
      ['-wide', '-wide', '-narrow'],
      ['-quarter', '-quarter', '-quarter', '-quarter']
    ];

    return (
      <div className="l-maps-container">
        {this.props.maps.map((map, index) =>
          <div className={`c-maps-list ${mapClasses[length - 1][index]}`} key={`map-${index}`}>
            <Map
              id={`${index}`}
              scenario={map.scenario}
              category={map.category}
              indicator={map.indicator}
              latLng={this.props.latLng}
              zoom={this.props.zoom}
              onMapDrag={this.props.onMapDrag}
              maps={this.props.maps}
              deleteMap={this.props.deleteMap}
              />
          </div>
        )}
      </div>
    );
  }
}

MapsList.contextTypes = {
  location: React.PropTypes.object
};

MapsList.propTypes = {
  maps: React.PropTypes.array,
  latLng: React.PropTypes.object,
  zoom: React.PropTypes.number,
  onMapDrag: React.PropTypes.func,
  deleteMap: React.PropTypes.func
};

export default MapsList;
