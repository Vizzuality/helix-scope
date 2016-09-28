import React from 'react';
import L from 'leaflet';
import { MAP_LAYER_SPEC, MAP_LAYER_SPEC_RASTER, MAP_VECTOR_CSS, MAP_RASTER_CSS } from 'constants/map';

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
      this.getLayer(props.mapData);
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

  getLayerTypeSpec(isRaster) {
    const spec = Object.assign({}, MAP_LAYER_SPEC);

    if (isRaster) {
      let layerSpecOptions = spec.layers[0].options;
      layerSpecOptions = Object.assign(layerSpecOptions, MAP_LAYER_SPEC_RASTER);
    }
    return spec;
  }

  getLayerData(data) {
    const spec = Object.assign({}, this.getLayerTypeSpec(data.raster));
    const layerOptions = spec.layers[0].options;

    layerOptions.sql = data.sql;
    layerOptions.cartocss = data.cartocss;

    return JSON.stringify(spec);
  }

  getLayer(mapData) {
    this.generateCartoCSS(mapData);

    const layer = this.getLayerData({
      sql: this.getQuery(mapData),
      cartocss: this.cartoCSS,
      raster: mapData.raster
    });

    this.props.createLayer(this.props.mapData, layer);
  }

  getQuery(mapData) {
    const scenario = 2;
    const season = 2;
    const measure = 'max';
    const tableName = 'avg_temperature';
    let query = `with r as (select value, iso from ${tableName} where measure like '${measure}' and scenario = ${scenario} and season = ${season} ) select r.iso, value, the_geom_webmercator from r inner join country_geoms s on r.iso=s.iso`;

    if (mapData.raster) {
      query = 'SELECT * FROM o_1_avg_temperature_sepoctnov_max';
    }

    return query;
  }

  updateLayer(layer) {
    if (this.layer) {
      this.map.removeLayer(this.layer);
    }
    this.layer = L.tileLayer(layer, { noWrap: true });
    this.layer.addTo(this.map);
  }

  generateCartoCSS(mapData) {
    if (mapData.raster) {
      this.gernerateCartoRaster();
    } else {
      this.generateCartoVector();
    }
  }

  generateCartoRaster() {
    // TO-DO move colors bucket to API
    const colorsBucket = ['#D6ECFC', '#BCECDC', '#70A9D2',
      '#5381D2', '#525FBD', '#3E39A1'];
    let stops = '';

    this.bucket.forEach((bucket, index) => {
      // No data and min value
      if (index === 0) {
        stops += `stop(${bucket.nodatavalue}, 'transparent', 'exact')`;
        stops += `stop(${bucket.raster_min}, ${colorsBucket[index]}, 'discrete')`;
      }
      stops += `stop(${bucket.raster_value}, ${colorsBucket[index]})`;
    });

    this.cartoCSS = Object.assign({}, MAP_RASTER_CSS);
    this.cartoCSS['raster-colorizer-stops'] = stops;
    this.cartoCSS = `#null ${JSON.stringify(this.cartoCSS)} `;
    this.cartoCSS = this.formatCartoCSS(this.cartoCSS);
  }


  generateCartoVector() {
    // TO-DO move colors bucket to API
    const colorsBucket = ['#D6ECFC', '#BCECDC', '#70A9D2',
      '#5381D2', '#525FBD', '#3E39A1'];

    const bucketList = Object.assign([], this.bucket);
    bucketList.reverse();

    this.cartoCSS = Object.assign({}, MAP_VECTOR_CSS);
    this.cartoCSS = `#null ${JSON.stringify(this.cartoCSS)} `;

    bucketList.forEach((bucket, index) => {
      this.cartoCSS += `#null [value <= ${bucket.value}] { polygon-fill: ${colorsBucket[index]}}`;
    });

    this.cartoCSS = this.formatCartoCSS(this.cartoCSS);
  }

  formatCartoCSS(carto) {
    let cartoCSS = carto;
    cartoCSS = cartoCSS.replace(/",/g, ';');
    cartoCSS = cartoCSS.replace(/"/g, '');
    cartoCSS = cartoCSS.replace(/\}/g, ';}');
    cartoCSS = cartoCSS.replace(/\b,/gi, ';');
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
