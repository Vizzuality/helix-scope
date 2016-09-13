import React from 'react';
import L from 'leaflet';
import Dashboard from 'containers/maps/DashboardContainer';

class Map extends React.Component {
  render() {
    const { id } = this.props;
    return (
      <div id={`map${id}`} className="c-map"></div>
   );
  }

  shouldComponentUpdate(props) {
    const shouldUpdate = props.scenario !== this.props.scenario ||
      props.scenario !== this.props.scenario ||
      props.category !== this.props.category ||
      props.indicator !== this.props.indicator;

    return shouldUpdate;
  }

  componentWillReceiveProps(props) {
    const paramsChanged = props.latLng.lat !== this.props.latLng.lat ||
      props.latLng.lng !== this.props.latLng.lng ||
      props.zoom !== this.props.zoom;

    if (paramsChanged) {
      this.map.setView([props.latLng.lat, props.latLng.lng], props.zoom);
      this.map.invalidateSize();
    }
  }

  componentDidMount() {
    this.map = L.map(`map${this.props.id}`);
    this.map.setView([this.props.latLng.lat, this.props.latLng.lng], this.props.zoom);
    this.map.zoomControl.setPosition('topright');
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // Set listeners
    this.setListeners();
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

  componentWillUnmount() {
    this.map.remove();
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
  maps: React.PropTypes.array,
  deleteMap: React.PropTypes.func
};

export default Map;
