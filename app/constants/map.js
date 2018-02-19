/* eslint-disable quote-props */

export const CARTODB_USER = 'helixscope';
export const ENDPOINT_TILES = `https://${CARTODB_USER}.carto.com/api/v1/map/`;
export const ENDPOINT_SQL = `https://${CARTODB_USER}.carto.com/api/v2/sql`;
export const MAX_MAPS = 4;
export const MAP_NUMBER_BUCKETS = 15;
export const MAP_MIN_ZOOM = 3;
export const MAP_MAX_BOUNDS = [
  [59.44, 182.98],
  [-30.14, -132.53]
];
export const MAP_LEGEND_MAX_TICKS = 7;

// Basemap

export const BASEMAP_GEOM_TILE = 'https://api.mapbox.com/styles/v1/helixscope/citvn5e3f005g2iolbpyl5g95/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaGVsaXhzY29wZSIsImEiOiJjaXR2bjJmNGMwMDFwMnRuMmdzdWNqOXBkIn0.B6OKT-f3aEZrC6kJJOm76w';
export const BASEMAP_LABELS_TILE = 'https://api.mapbox.com/styles/v1/helixscope-labels/citvnt8pw00522itb0b7htist/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaGVsaXhzY29wZS1sYWJlbHMiLCJhIjoiY2l0dm5zcmk1MDAyZzJ5bjI0bGc4cGd3MiJ9.wttaMZn3jPGnpaotFhNTFA';

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
  'polygon-gamma': 0
};

export const MAP_RASTER_CSS = {
  'raster-scaling': 'near',
  'raster-colorizer-default-mode': 'linear',
  'raster-colorizer-default-color': 'transparent',
  'raster-colorizer-epsilon': '0.1',
  'raster-colorizer-stops': ''
};

export const getTableName = (category, indicator) => `table_${category}_${indicator}`;

export const metadataInfoText = {
  'pr': 'Monthly average precipitation (mm). These data were created using the HADGEM3, ECEARTH models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'tx': 'Annual average maximum temperature (°C). These data were created using the HADGEM3, ECEARTH models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'tn': 'Annual average minimum temperature (°C). These data were created using the HADGEM3, ECEARTH models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'ts': 'Annual average temperature (°C). These data were created using the HADGEM3, ECEARTH models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'amphibianobiodiversity': 'Amphibian species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'birdrealbiodiversity': 'Bird species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'birdnobiodiversity': 'Bird species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'reptilerealbiodiversity': 'Reptile species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'reptilenobiodiversity': 'Reptile species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'mammalnobiodiversity': 'Mammalian species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'amphibiarealbiodiversity': 'Amphibian species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'mammalrealbiodiversity': 'Mammalian species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time. These data were created using orchidee models of the Tyndall Centre for Climate Change Research, University of East Anglia.',
  'nbp': 'Net Biome productivity (gC m-2 yr-1). These data were created using orchidee models procesed by LSCE.',
  'evap': 'Evapotranspiration (kg m-2 yr-1). These data were created using orchidee models procesed by LSCE.',
  'gpp': 'Gross Primary Productivity (gC m-2 yr-1). These data were created using orchidee models procesed by LSCE.',
  'cVeg': 'Vegetation biomass (kg m-2). These data were created using orchidee models procesed by LSCE.',
  'cSoil': 'Soil carbon content (kg m-2). These data were created using orchidee models procesed by LSCE.',
  'time_perc_change_SPI6': 'Change in time under drought conditions in percent (%), defined as the sum of months with 6-month Standardised Precipitation Index (SPI6) below the value -1.5, relative to the average over the baseline period of 1981-2010. These data were created using orchidee models procesed by LSCE.',
  'perc_change_low_roff': 'Relative (%) change in 10th percentile runoff production, derived from daily runoff data. These data were created using orchidee models procesed by LSCE.',
  'time_perc_change_SRI6': 'Change in time under drought conditions in percent (%), defined as the sum of months with 6-month Standardised Runoff Index (SRI6) below the value -1.5, relative to the average over the baseline period of 1981-2010. These data were created using orchidee models procesed by LSCE.',
  'perc_change_roff': 'Relative (%) change in mean runoff production, derived from daily runoff data. These data were created using orchidee models procesed by LSCE.',
  'time_perc_change_SPI48': 'Change in time under drought conditions in percent (%), defined as the sum of months with 48-month Standardised Precipitation Index (SPI48) below the value -1.5, relative to the average over the baseline period of 1981-2010. These data were created using orchidee models procesed by LSCE.',
  'time_perc_change_SRI48': 'Change in time under drought conditions in percent (%), defined as the sum of months with 48-month Standardised Runoff Index (SRI48) below the value -1.5, relative to the average over the baseline period of 1981-2010. These data were created using orchidee models procesed by LSCE.'
};