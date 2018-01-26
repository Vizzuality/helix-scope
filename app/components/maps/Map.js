import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import axios from 'axios';
import L from 'leaflet';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Popup from 'components/common/Popup';
import MapPopupPlot from 'components/charts/MapPopupPlot';
import objectToCSS from 'utils/objectToCSS';
import {
  BASEMAP_GEOM_TILE,
  BASEMAP_LABELS_TILE,
  ENDPOINT_SQL,
  MAP_MIN_ZOOM,
  MAP_LAYER_SPEC,
  MAP_VECTOR_CSS
} from 'constants/map';
import { categoryColorScheme } from 'constants/colors';

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
    this.map.on('zoomend', () => {
      this.props.onMapDrag(this.getMapParams());
    });
    this.map.on('drag', () => {
      this.props.onMapDrag(this.getMapParams());
    });
    this.map.on('popupclose', ({ popup }) => {
      unmountComponentAtNode(
        document.querySelector(`.${popup.options.className} .leaflet-popup-content`)
      );
    });
    this.map.on('click', (e) => {
      const {
        lng,
        lat
      } = e.latlng;

      if (!this.props.mapData) return;

      this.getPopupData(lng, lat)
        .then(this.createPopup.bind(this, lng, lat));
    });
  }

  getPopupData(lng, lat) {
    const {
      measure,
      scenario,
      indicator
    } = this.props.mapData;

    const query = `
      SELECT
        m.model_short_name,
        m.model_long_name,
        run,
        ${measure.slug} as value
      FROM five_grid_shapefiles s
        INNER JOIN master_5x5 m on m.shape_id = s.id_val
      WHERE
        ST_WITHIN(
          ST_GeomFromText('POINT(${lng} ${lat})', 4326),
          s.the_geom
        )
        AND m.swl_info = ${scenario.slug}
        AND m.variable = '${indicator.slug}'
    `;

    return axios.get(ENDPOINT_SQL, {
      params: {
        q: query
      }
    })
      .then((response) => response.data.rows)
      .catch((error) => {
        console.error(error);
      });
  }

  getLatLng() {
    const latLng = this.map.getCenter();

    return {
      lat: latLng.lat.toFixed(2),
      lng: latLng.lng.toFixed(2)
    };
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

  getLayerTypeSpec() {
    const spec = Object.assign({}, MAP_LAYER_SPEC);
    return spec;
  }

  getLayerData(data) {
    const spec = Object.assign({}, this.getLayerTypeSpec());
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
      cartocss: this.cartoCSS
    });

    this.props.createLayer(mapData, layer);
  }

  getQuery(mapData) {
    const indicator = mapData.indicator.slug;
    const scenario = mapData.scenario.slug;
    const measure = mapData.measure.slug;

    const query = `
      WITH data AS (
        SELECT shape_id, AVG(${measure}) AS ${measure}
        FROM master_5x5
        WHERE variable = '${indicator}'
        AND swl_info = ${scenario}
        GROUP BY shape_id
      )
      SELECT five_grid_shapefiles.id_val, five_grid_shapefiles.the_geom_webmercator, five_grid_shapefiles.cartodb_id, data.${measure}
      FROM five_grid_shapefiles INNER JOIN data ON five_grid_shapefiles.id_val = data.shape_id
    `;

    return query;
  }

  createPopup(lng, lat, data) {
    if (!data || !data.length) return;

    const {
      id,
      measure,
      scenario,
      indicator
    } = this.props.mapData;

    const title = `${indicator.name} under ${scenario.name}`;
    const mean = data.map((d) => d.value).reduce((acc, v) => acc + v, 0) / data.length;
    const popupClassName = `details-popup-${id}`;
    const popup = L.popup({
      className: popupClassName,
      closeButton: false,
      maxWidth: 400,
      minWidth: 400
    })
      .setLatLng(L.latLng(lat, lng))
      .openOn(this.map);

    render(
      <Popup title={title} onCloseClick={() => this.map.closePopup(popup)}>
        <MapPopupPlot data={data} unit={indicator.unit} />
        <div>
          Each point represents a model run. Together, they represent the range of possible futures
          for the ${measure.name} of ${indicator.name} in the area you have selected, in a world
          which has experienced ${scenario.name} relative to pre-industrial levels.
          The map shows the average values of the model projections (${mean.toFixed(2)} ${indicator.unit}).
        </div>
      </Popup>,
      document.querySelector(`.${popupClassName} .leaflet-popup-content`)
    );
  }

  updateLayer(layer) {
    if (this.layer) {
      this.layer.setUrl(layer.tileUrl);
      this.currentLayer = layer.slug;
    } else {
      this.layer = L.tileLayer(layer.tileUrl, {
        attribution: 'CARTO <a href="https://carto.com/attributions" target="_blank">attribution</a>'
      }).setZIndex(2);
      this.layer.on('load', this.onTileLoaded);
      this.layer.addTo(this.map);
      this.currentLayer = layer.slug;
    }
  }

  generateCartoCSS(mapData) {
    const colorscheme = [...categoryColorScheme[mapData.category.slug]].reverse();
    const bucketList = [...this.bucket].reverse();

    const cssProps = {
      '#null': { ...MAP_VECTOR_CSS }
    };

    bucketList.forEach((bucket, index) => {
      const key = `#null[${mapData.measure.slug} <= ${bucket.value}]`;
      cssProps[key] = { 'polygon-fill': colorscheme[index] };
    });

    this.cartoCSS = objectToCSS(cssProps);
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
    measure: React.PropTypes.object,
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
