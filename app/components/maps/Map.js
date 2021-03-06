import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import axios from 'axios';
import L from 'leaflet';
import uuid from 'uuid';
import PropTypes from 'prop-types';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Popup from 'components/common/Popup';
import MapPopupPlot from 'components/charts/MapPopupPlot';
import objectToCSS from 'utils/objectToCSS';
import {
  getTableName,
  BASEMAP_GEOM_TILE,
  BASEMAP_LABELS_TILE,
  ENDPOINT_SQL,
  MAP_MIN_ZOOM,
  MAP_LAYER_SPEC,
  MAP_VECTOR_CSS
} from 'constants/map';
import { getColorSchemeByBuckets } from 'utils/colors';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tileLoading: false };
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
    this.addCartoLogo(this.map);

    // Set listeners
    this.setListeners();

    // Get buckets for the legend and layer
    if (!this.props.mapData.buckets) {
      this.props.getMapBuckets(this.props.mapData);
    }
    // Get layer
    if (this.props.mapData.buckets) {
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
    const bucketsChanged = JSON.stringify(props.mapData.buckets) !== JSON.stringify(this.props.mapData.buckets);
    const newBucketEmpty = !Array.isArray(props.mapData.buckets) || !props.mapData.buckets.length;

    if (paramsChanged) {
      this.map.panTo([props.mapConfig.latLng.lat, props.mapConfig.latLng.lng], {
        animate: false
      });
      this.map.setZoom(props.mapConfig.zoom);

      this.invalidateSize();
    }

    if (!props.mapData.buckets && bucketsChanged) {
      this.buckets = props.mapData.buckets;
      props.getMapBuckets(props.mapData);
    }

    if (this.buckets && props.mapData.layer &&
        (this.currentLayer !== props.mapData.layer.slug)) {
      this.updateLayer(props.mapData.layer);
    }

    if (bucketsChanged && !newBucketEmpty) {
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
      props.mapData.bucketsLoading !== this.props.mapData.bucketsLoading ||
      state.tileLoading !== this.state.tileLoading;

    return shouldUpdate;
  }

  componentWillUnmount() {
    this.map.remove();
  }

  onTileLoaded() {
    this.setTileLoadingStatus(false);
  }

  setTileLoadingStatus(status) {
    this.setState({ tileLoading: status });
  }

  setListeners() {
    this.map.on('zoomend', () => {
      this.props.onMapDrag(this.getMapParams());
    });
    this.map.on('drag', () => {
      this.props.onMapDrag(this.getMapParams());
    });
    this.map.on('popupclose', ({ popup }) => {
      const element = popup.getElement().getElementsByClassName('leaflet-popup-content')[0];

      if (element) unmountComponentAtNode(element);
    });
    this.map.on('click', (e) => {
      const { lng, lat } = e.latlng;
      const { lng: wLng, lat: wLat } = e.latlng.wrap(); // wrap to work with world copy

      if (!this.props.mapData) return;

      this.getPopupData(wLng, wLat)
        .then(this.createPopup.bind(this, lng, lat));
    });
  }

  getPopupData(lng, lat) {
    const {
      category,
      scenario,
      indicator
    } = this.props.mapData;

    const query = `
      SELECT
        m.model_short_name,
        mean as value
      FROM onedegintermod s
        INNER JOIN ${getTableName(category.slug, indicator.slug)} m on m.shape_id = s.id_val
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
    this.setTileLoadingStatus(true);

    this.buckets = mapData.buckets;
    this.generateCartoCSS(mapData);
    const layer = this.getLayerData({
      sql: this.getQuery(mapData),
      cartocss: this.cartoCSS
    });

    this.props.createLayer(mapData, layer);
  }

  getQuery(mapData) {
    const category = mapData.category.slug;
    const indicator = mapData.indicator.slug;
    const scenario = mapData.scenario.slug;
    const query = `
      WITH data AS (
        SELECT shape_id, AVG(mean) AS value
        FROM ${getTableName(category, indicator)}
        WHERE variable = '${indicator}'
        AND swl_info = ${scenario}
        GROUP BY shape_id
      )
      SELECT onedegintermod.id_val, onedegintermod.the_geom_webmercator, onedegintermod.cartodb_id, data.value
      FROM onedegintermod INNER JOIN data ON onedegintermod.id_val = data.shape_id
    `;

    return query;
  }

  addCartoLogo(map) {
    const cartoLogo = new L.Control({ position: 'bottomleft' });
    cartoLogo.onAdd = () => {
      const link = L.DomUtil.create('a');
      link.href = 'https://carto.com';
      link.style = 'cursor: pointer';
      link.innerHTML = '<img src="/images/carto.svg" alt="CARTO" />';
      return link;
    };
    cartoLogo.addTo(map);
  }

  createPopup(lng, lat, data) {
    if (!data || !data.length) return;

    const { scenario, indicator } = this.props.mapData;

    const id = uuid();
    const title = `${indicator.name} under ${scenario.name}`;
    const mean = data.map((d) => d.value).reduce((acc, v) => acc + v, 0) / data.length;
    const popupClassName = `details-popup-${id}`;
    const popup = L.popup({
      className: popupClassName,
      closeButton: false,
      maxWidth: 400,
      minWidth: 400
    }).setLatLng(L.latLng(lat, lng)).openOn(this.map);

    render(
      <Popup title={title} onCloseClick={() => this.map.closePopup(popup)}>
        <MapPopupPlot data={data} unit={indicator.unit} />
        <div>
          Each point represents a model run. Together, they represent the range of possible futures
          of {indicator.name} in the area you have selected, in a world
          which has experienced {scenario.name} relative to pre-industrial levels.
          The map shows the average values of the model projections ({mean.toFixed(2)} {indicator.unit}).
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
      this.layer = L.tileLayer(layer.tileUrl).setZIndex(2);
      this.layer.on('load', this.onTileLoaded);
      this.layer.addTo(this.map);
      this.currentLayer = layer.slug;
    }
  }

  generateCartoCSS({ category, indicator }) {
    const colorscheme = [...getColorSchemeByBuckets(category.slug, indicator.slug, this.buckets)].reverse();
    const reverseBuckets = [...this.buckets].reverse();

    const cssProps = {
      '#null': { ...MAP_VECTOR_CSS }
    };

    reverseBuckets.forEach((bucketValue, index) => {
      const key = `#null[value <= ${bucketValue}]`;
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
    const { id, bucketsLoading } = this.props.mapData;
    const isLoading = this.state.tileLoading || bucketsLoading;
    return (
      <div className="c-map">
        <div id={`map${id}`}></div>
        {isLoading && <LoadingSpinner inner />}
      </div>
    );
  }
}

Map.propTypes = {
  mapData: PropTypes.shape({
    id: PropTypes.string,
    layer: PropTypes.object,
    scenario: PropTypes.object,
    category: PropTypes.object,
    indicator: PropTypes.object,
    minValue: PropTypes.number,
    buckets: PropTypes.array,
    bucketsLoading: PropTypes.bool
  }).isRequired,
  mapConfig: PropTypes.shape({
    latLng: PropTypes.object,
    zoom: PropTypes.number
  }).isRequired,
  onMapDrag: PropTypes.func,
  createLayer: PropTypes.func,
  getMapBuckets: PropTypes.func,
  invalidateSize: PropTypes.bool
};

export default Map;
