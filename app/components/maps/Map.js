import React from 'react';
import L from 'leaflet';
import { CARTODB_USER, MAP_VECTOR_CSS, MAP_RASTER_CSS } from 'constants/map';

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

    if ((!this.bucket && props.mapData.bucket) ||
      (props.mapData.bucket && props.mapData.bucket !== this.props.mapData.bucket)) {
      this.bucket = props.mapData.bucket;
      this.getLayer();
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

    this.props.getMapBuckets(this.props.mapData);
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

  getLayerTypeSpec(type) {
    const spec = {
      layers: [{
        user_name: CARTODB_USER,
        type: 'cartodb',
        options: {
          sql: '',
          cartocss: '',
          cartocss_version: '2.3.0'
        }
      }]
    };

    if (type === 'raster') {
      const layerSpecOptions = spec.layers[0].options;
      layerSpecOptions.raster = true;
      layerSpecOptions.raster_band = 1;
      layerSpecOptions.geom_column = 'the_raster_webmercator';
      layerSpecOptions.geom_type = 'raster';
    }
    return spec;
  }

  getLayerData(data) {
    const spec = Object.assign({}, this.getLayerTypeSpec(data.type));
    const layerOptions = spec.layers[0].options;

    layerOptions.sql = data.sql;
    layerOptions.cartocss = data.cartocss;

    return JSON.stringify(spec);
  }

  getLayer() {
    const layerType = 'raster';

    this.generateCartoCSS(layerType);

    const layer = this.getLayerData({
      sql: this.getQuery(layerType),
      cartocss: this.cartoCSS,
      type: layerType
    });

    this.props.createLayer(this.props.mapData, layer);
  }

  getQuery(layerType) {
    let query = 'SELECT * FROM avg_temperature_sepoctnov_max';

    if (layerType === 'raster') {
      query = 'SELECT * FROM o_1_avg_temperature_sepoctnov_max';
    }

    return query;
  }

  generateCartoCSS(layerType) {
    const colorsBucket = ['#D6ECFC', '#BCECDC', '#70A9D2',
      '#5381D2', '#525FBD', '#3E39A1'];

    if (layerType === 'raster') {
      let stops = '';

      this.bucket.forEach((bucket, index) => {
        stops += `stop(${bucket.value}, ${colorsBucket[index]})`;
      });

      this.cartoCSS = Object.assign({}, MAP_RASTER_CSS);
      this.cartoCSS['raster-colorizer-stops'] = stops;
      this.cartoCSS = `#null ${JSON.stringify(this.cartoCSS)} `;
      this.cartoCSS = this.formatCartoCSS(this.cartoCSS);
    } else {
      const filter = 'area';

      this.cartoCSS = Object.assign({}, MAP_VECTOR_CSS);
      this.cartoCSS = this.formatCartoCSS(this.cartoCSS);
      this.bucket.forEach((bucket, index) => {
        this.cartoCSS += `#null [${filter} <= ${bucket.value}] { polygon-fill: ${colorsBucket[index]};}`;
      });
    }
  }

  formatCartoCSS(carto) {
    let cartoCSS = carto;
    cartoCSS = cartoCSS.replace(/",/g, ';');
    cartoCSS = cartoCSS.replace(/"/g, '');
    cartoCSS = cartoCSS.replace(/\}/g, ';}');
    return cartoCSS;
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
    indicator: React.PropTypes.string,
    bucket: React.PropTypes.array
  }).isRequired,
  mapConfig: React.PropTypes.shape({
    latLng: React.PropTypes.object,
    zoom: React.PropTypes.number
  }).isRequired,
  onMapDrag: React.PropTypes.func,
  createLayer: React.PropTypes.func,
  getMapBuckets: React.PropTypes.func
};

export default Map;
