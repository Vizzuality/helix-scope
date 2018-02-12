import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

import { BASEMAP_GEOM_TILE, BASEMAP_LABELS_TILE, MAP_MIN_ZOOM } from 'constants/map';

class Map extends React.Component {

  componentDidMount() {
    this.map = L.map('map-base', {
      minZoom: MAP_MIN_ZOOM,
      zoom: this.props.mapConfig.zoom,
      center: [this.props.mapConfig.latLng.lat, this.props.mapConfig.latLng.lng],
      detectRetina: true
    });

    this.map.attributionControl.addAttribution('© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>');
    this.map.zoomControl.setPosition('topright');
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer(BASEMAP_GEOM_TILE).addTo(this.map).setZIndex(0);
    this.tileLayerLabels = L.tileLayer(BASEMAP_LABELS_TILE).addTo(this.map).setZIndex(1);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <div className="l-maps-container">
        <div id={'map-base'} className="c-map -full"></div>
      </div>
    );
  }
}

Map.propTypes = {
  mapConfig: PropTypes.shape({
    latLng: PropTypes.object,
    zoom: PropTypes.number
  }).isRequired
};

export default Map;
