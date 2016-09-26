import React from 'react';
import L from 'leaflet';

class Map extends React.Component {

  componentDidMount() {
    this.map = L.map(`map${this.props.mapData.id}`);
    this.map.setView(
      [this.props.mapConfig.latLng.lat, this.props.mapConfig.latLng.lng],
      this.props.mapConfig.zoom);
    this.map.zoomControl.setPosition('topright');
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Set listeners
    this.setListeners();
  }

  componentWillReceiveProps(props) {
    const paramsChanged = props.mapConfig.latLng.lat !== this.props.mapConfig.latLng.lat ||
      props.mapConfig.latLng.lng !== this.props.mapConfig.latLng.lng ||
      props.mapConfig.zoom !== this.props.mapConfig.zoom;

    if (paramsChanged) {
      this.map.setView(
        [props.mapConfig.latLng.lat, props.mapConfig.latLng.lng],
        props.mapConfig.zoom);

      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }

      this.resizeTimer = setTimeout(() => {
        this.map.invalidateSize();
      }, 10);
    }

    if ((!this.layer && props.mapData.layer) ||
      (props.mapData.layer && props.mapData.layer !== this.props.mapData.layer)) {
      this.updateLayer(props.mapData.layer);
    }
  }

  shouldComponentUpdate(props) {
    const shouldUpdate = props.mapData.scenario !== this.props.mapData.scenario ||
      props.mapData.scenario !== this.props.mapData.scenario ||
      props.mapData.category !== this.props.mapData.category ||
      props.mapData.indicator !== this.props.mapData.indicator;

    return shouldUpdate;
  }

  componentWillUnmount() {
    this.map.remove();
  }

  setListeners() {
    function zoomend() {
      this.props.onMapDrag(this.getMapParams());
    }
    function dragend() {
      this.props.onMapDrag(this.getMapParams());
    }

    this.map.on('zoomend', zoomend.bind(this));
    this.map.on('dragend', dragend.bind(this));

    this.props.createLayer({
      layer: {
        map: this.props.mapData.id,
        layer: {
          sql: 'SELECT * FROM country_geoms',
          cartocss: '#null{polygon-fill: #FF6600;polygon-opacity: 0.5;}'
        }
      }
    });
  }

  getLatLng() {
    const latLng = this.map.getCenter();
    latLng.lat = latLng.lat.toFixed(2);
    latLng.lng = latLng.lng.toFixed(2);

    return latLng;
  }

  getZoom() {
    return this.map.getZoom();
  }

  getMapParams() {
    return {
      latLng: this.getLatLng(),
      zoom: this.getZoom()
    };
  }

  updateLayer(layer) {
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }
    this.layer = L.tileLayer(layer, { noWrap: true });
    this.layer.addTo(this.map);
  }

  render() {
    const { id } = this.props.mapData;
    return (
      <div id={`map${id}`} className="c-map"></div>
   );
  }
}

Map.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    layer: React.PropTypes.string,
    scenario: React.PropTypes.string,
    category: React.PropTypes.string,
    indicator: React.PropTypes.string
  }).isRequired,
  mapConfig: React.PropTypes.shape({
    latLng: React.PropTypes.object,
    zoom: React.PropTypes.number
  }).isRequired,
  onMapDrag: React.PropTypes.func,
  deleteMap: React.PropTypes.func,
  createLayer: React.PropTypes.func,
  indicators: React.PropTypes.array
};

export default Map;
