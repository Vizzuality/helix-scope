import React from 'react';
import L from 'leaflet';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { BASEMAP_GEOM_TILE, BASEMAP_LABELS_TILE, MAP_MIN_ZOOM, MAP_LAYER_SPEC, MAP_LAYER_SPEC_RASTER, MAP_VECTOR_CSS, MAP_RASTER_CSS } from 'constants/map';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.onTileLoaded = this.onTileLoaded.bind(this);
  }

  componentDidMount() {
    this.map = L.map(`map${this.props.mapData.id}`, {
      minZoom: MAP_MIN_ZOOM,
      zoom: this.props.mapConfig.zoom,
      center: [this.props.mapConfig.latLng.lat, this.props.mapConfig.latLng.lng],
      detectRetina: true
    });

    this.map.attributionControl.addAttribution('© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>');
    this.map.zoomControl.setPosition('topright');
    this.map.scrollWheelZoom.disable();
    this.tileLayer = L.tileLayer(BASEMAP_GEOM_TILE).addTo(this.map).setZIndex(0);
    this.tileLayerLabels = L.tileLayer(BASEMAP_LABELS_TILE).addTo(this.map).setZIndex(3);

    // Set listeners
    this.setListeners();

    // Get buckets for the legend and layer
    if (!this.props.mapData.bucket) {
      this.props.getMapBuckets(this.props.mapData);
    }
    // Get layer
    if (this.props.mapData.bucket) {
      if (this.props.mapData.layer) {
        this.updateLayer(this.props.mapData.layer);
      } else {
        this.getLayer(this.props.mapData);
      }
    }
  }

  componentWillReceiveProps(props) {
    const paramsChanged = (props.mapConfig.source &&
      (props.mapConfig.source !== this.props.mapData.id)) && (
      props.mapConfig.latLng.lat !== this.props.mapConfig.latLng.lat ||
      props.mapConfig.latLng.lng !== this.props.mapConfig.latLng.lng ||
      props.mapConfig.zoom !== this.props.mapConfig.zoom);

    if (paramsChanged) {
      this.map.panTo([props.mapConfig.latLng.lat, props.mapConfig.latLng.lng], {
        animate: false
      });
      this.map.setZoom(props.mapConfig.zoom);

      this.invalidateSize();
    }

    if (props.mapData.bucket && !props.mapData.bucket.length) {
      this.bucket = props.mapData.bucket;
      this.setLoadingStatus(true);
      props.getMapBuckets(this.props.mapData);
    }

    if (this.bucket && props.mapData.layer &&
      (this.currentLayer !== props.mapData.layer.slug)) {
      this.updateLayer(props.mapData.layer);
    }

    if ((!this.bucket && props.mapData.bucket) ||
      (this.bucket !== props.mapData.bucket)) {
      this.getLayer(props.mapData);
    }

    if (props.invalidateSize) {
      this.invalidateSize();
    }
  }

  shouldComponentUpdate(props, state) {
    const shouldUpdate = props.mapData.scenario !== this.props.mapData.scenario ||
      props.mapData.scenario !== this.props.mapData.scenario ||
      props.mapData.category !== this.props.mapData.category ||
      props.mapData.indicator !== this.props.mapData.indicator ||
      state.loading !== this.state.loading;

    return shouldUpdate;
  }

  componentWillUnmount() {
    this.map.remove();
  }

  onTileLoaded() {
    this.setLoadingStatus(false);
  }

  setLoadingStatus(status) {
    this.setState({
      loading: status
    });
  }

  setListeners() {
    function zoomend() {
      this.props.onMapDrag(this.getMapParams());
    }
    function drag() {
      this.props.onMapDrag(this.getMapParams());
    }

    this.map.on('zoomend', zoomend.bind(this));
    this.map.on('drag', drag.bind(this));
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
    const latLng = this.getLatLng();
    const params = {
      zoom: this.getZoom(),
      source: this.props.mapData.id
    };

    if (latLng) {
      params.latLng = latLng;
    }

    return params;
  }

  getLayerTypeSpec(isRaster) {
    const spec = Object.assign({}, MAP_LAYER_SPEC);

    if (!isRaster) {
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
    this.bucket = mapData.bucket;
    this.generateCartoCSS(mapData);
    const layer = this.getLayerData({
      sql: this.getQuery(mapData),
      cartocss: this.cartoCSS,
      raster: mapData.raster
    });

    this.props.createLayer(mapData, layer);
  }

  getQuery(mapData) {
    const scenario = mapData.scenario.slug;
    const season = 2;
    const measure = mapData.measure.slug;
    const tableName = mapData.indicator.tableName;

    let query = `with r as (select value, iso from ${tableName} where measure like '${measure}' and scenario = ${scenario} and season = ${season} ) select r.iso, value, the_geom_webmercator from r inner join country_geoms s on r.iso=s.iso`;

    if (!mapData.raster) {
      query = `SELECT * FROM ${mapData.indicator.tableName}_${mapData.measure.slug}_${mapData.scenario.slug}_1`;
    }

    return query;
  }

  updateLayer(layer) {
    if (this.layer) {
      this.layer.setUrl(layer.tileUrl);
      this.currentLayer = layer.slug;
    } else {
      this.layer = L.tileLayer(layer.tileUrl, {
        noWrap: true,
        attribution: 'CARTO <a href="https://carto.com/attributions" target="_blank">attribution</a>'
      }).setZIndex(2);
      this.layer.on('load', this.onTileLoaded);
      this.layer.addTo(this.map);
      this.currentLayer = layer.slug;
    }
  }

  generateCartoCSS(mapData) {
    if (!mapData.raster) {
      this.generateCartoRaster(mapData);
    } else {
      this.generateCartoVector(mapData);
    }
  }

  generateCartoRaster(mapData) {
    const colorsBucket = mapData.indicator.colorScheme;
    let stops = '';
    let isPositiveNumber = false;

    this.bucket.forEach((bucket, index) => {
      if (bucket.raster_value > 0 && !isPositiveNumber) {
        isPositiveNumber = true;
        // No data and min value
        stops += `stop(${bucket.nodatavalue}, transparent, exact) `;
        stops += `stop(${bucket.raster_min}, ${colorsBucket[index]}, discrete) `;
      }

      stops += `stop(${bucket.raster_value}, ${colorsBucket[index]}) `;
    });

    this.cartoCSS = Object.assign({}, MAP_RASTER_CSS);
    this.cartoCSS['raster-colorizer-stops'] = stops;
    this.cartoCSS = `#null ${JSON.stringify(this.cartoCSS)} `;
    this.cartoCSS = this.formatCartoCSS(this.cartoCSS);
  }


  generateCartoVector(mapData) {
    const colorsBucket = mapData.indicator.colorScheme;

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
    return cartoCSS;
  }

  invalidateSize() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }

    this.resizeTimer = setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  render() {
    const { id } = this.props.mapData;
    return (
      <div className="c-map">
        <div id={`map${id}`}></div>
        {this.state.loading && <LoadingSpinner inner />}
      </div>
    );
  }
}

Map.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    layer: React.PropTypes.object,
    scenario: React.PropTypes.object,
    category: React.PropTypes.object,
    indicator: React.PropTypes.object,
    bucket: React.PropTypes.array
  }).isRequired,
  mapConfig: React.PropTypes.shape({
    latLng: React.PropTypes.object,
    zoom: React.PropTypes.number
  }).isRequired,
  onMapDrag: React.PropTypes.func,
  createLayer: React.PropTypes.func,
  getMapBuckets: React.PropTypes.func,
  invalidateSize: React.PropTypes.bool
};

export default Map;
