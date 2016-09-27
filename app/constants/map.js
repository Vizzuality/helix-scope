// const CARTODB_USER = 'helixscope';
export const CARTODB_USER = 'geriux';
export const ENDPOINT_TILES = `https://${CARTODB_USER}.carto.com/api/v1/map/`;
export const ENDPOINT_SQL = `https://${CARTODB_USER}.carto.com/api/v2/sql`;
export const MAX_MAPS = 4;
export const MAP_NUMBER_BUCKETS = 6;

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