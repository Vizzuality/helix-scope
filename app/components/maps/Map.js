import React from 'react';
import L from 'leaflet';

class Map extends React.Component {

  componentDidMount() {
    this.map = L.map(`map${this.props.id}`);
    this.map.setView([this.props.latLng.lat, this.props.latLng.lng], this.props.zoom);
    this.map.zoomControl.setPosition('topright');
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Set listeners
    this.setListeners();
  }

  componentWillReceiveProps(props) {
    const paramsChanged = props.latLng.lat !== this.props.latLng.lat ||
      props.latLng.lng !== this.props.latLng.lng ||
      props.zoom !== this.props.zoom || props.maps !== this.props.maps;

    if (paramsChanged) {
      this.map.setView([props.latLng.lat, props.latLng.lng], props.zoom);

      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }

      this.resizeTimer = setTimeout(() => {
        this.map.invalidateSize();
      }, 10);
    }
  }

  shouldComponentUpdate(props) {
    const shouldUpdate = props.scenario !== this.props.scenario ||
      props.scenario !== this.props.scenario ||
      props.category !== this.props.category ||
      props.indicator !== this.props.indicator;

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

  render() {
    const { id } = this.props;
    return (
      <div id={`map${id}`} className="c-map"></div>
   );
  }
}

Map.propTypes = {
  id: React.PropTypes.string,
  scenario: React.PropTypes.string,
  category: React.PropTypes.string,
  indicator: React.PropTypes.string,
  latLng: React.PropTypes.object,
  zoom: React.PropTypes.number,
  onMapDrag: React.PropTypes.func,
  maps: React.PropTypes.array
};

export default Map;
