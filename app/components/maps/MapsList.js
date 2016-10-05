import React from 'react';
import Map from 'containers/maps/Map';
import Dashboard from 'containers/maps/DashboardContainer';

class MapsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.invalidateSize = false;
  }

  componentWillReceiveProps(props) {
    if (props.maps && this.props.maps.length !== props.maps.length) {
      this.invalidateSize = true;
    } else {
      this.invalidateSize = false;
    }
  }

  render() {
    const numMaps = this.props.maps.length;
    const mapClasses = [
      ['-full'],
      ['-horizontal', '-horizontal'],
      ['-wide', '-wide', '-narrow'],
      ['-quarter', '-quarter', '-quarter', '-quarter']
    ];

    return (
      <div className="l-maps-container">
        {this.props.maps.map((map, index) =>
          <div className={`c-maps-list ${mapClasses[numMaps - 1][index]}`} key={`map-${index}`}>
            <div className="scenario-wrapper">
              <Dashboard
                mapData={map}
                handleMapConfig={this.props.handleMapConfig}
              />
              <Map
                mapData={map}
                invalidateSize={this.invalidateSize}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

MapsList.propTypes = {
  maps: React.PropTypes.array,
  handleMapConfig: React.PropTypes.func
};

export default MapsList;
