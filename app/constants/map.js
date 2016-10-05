export const CARTODB_USER = 'helixscope';
export const ENDPOINT_TILES = `https://${CARTODB_USER}.carto.com/api/v1/map/`;
export const ENDPOINT_SQL = `https://${CARTODB_USER}.carto.com/api/v2/sql`;
export const MAX_MAPS = 4;
export const MAP_NUMBER_BUCKETS = 6;
export const MAP_MAX_BOUNDS = [
  [59.44, 182.98],
  [-30.14, -132.53]
];

// Basemap

export const BASEMAP_GEOM_TILE = 'https://api.mapbox.com/styles/v1/helixscope/citvn5e3f005g2iolbpyl5g95/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVsaXhzY29wZSIsImEiOiJjaXR2bjJmNGMwMDFwMnRuMmdzdWNqOXBkIn0.B6OKT-f3aEZrC6kJJOm76w';
export const BASEMAP_LABELS_TILE = 'https://api.mapbox.com/styles/v1/helixscope-labels/citvnt8pw00522itb0b7htist/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVsaXhzY29wZS1sYWJlbHMiLCJhIjoiY2l0dm5zcmk1MDAyZzJ5bjI0bGc4cGd3MiJ9.wttaMZn3jPGnpaotFhNTFA';

// Layer spec

export const MAP_LAYER_SPEC = {
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

export const MAP_LAYER_SPEC_RASTER = {
  raster: true,
  raster_band: 1,
  geom_column: 'the_raster_webmercator',
  geom_type: 'raster'
};

// Carto CSS

export const MAP_VECTOR_CSS = {
  'polygon-opacity': 1,
  'polygon-fill': 'transparent',
  'line-width': 0.5,
  'line-color': '#FFFFFF',
  'line-opacity': 1,
  'line-rasterizer': 'fast'
};

export const MAP_RASTER_CSS = {
  'raster-scaling': 'near',
  'raster-colorizer-default-mode': 'linear',
  'raster-colorizer-default-color': 'transparent',
  'raster-colorizer-epsilon': '0.1',
  'raster-colorizer-stops': ''
};
