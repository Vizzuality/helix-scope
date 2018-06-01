/* eslint-disable quote-props,camelcase,max-len */

const scenarios = {
  '1.5': '1.5°C global warming',
  '2': '2°C global warming',
  '4': '4°C global warming'
};

const measurements = {
  'min': 'minimum',
  'max': 'maximum',
  'mean': 'mean',
  'std': 'standard deviation'
};

const categories = {
  'bd': 'Biodiversity',
  'w': 'Water',
  'eco': 'Land carbon cycle',
  'ag': 'Agriculture',
  'cl': 'Climate'
};

const categories_indicators_country = {
  'ag': [
    'Maize_yield_perc_change',
    'Wheat_yield_perc_change',
    'Soybeans_yield_perc_change',
    'Soybeans_Irrigation_avoided_perc_change',
    'Rice_Irrigation_avoided_perc_change',
    'Wheat_Irrigation_avoided_perc_change',
    'Rice_yield_perc_change',
    'Maize_Irrigation_avoided_perc_change'
  ],
  'bd': [
    'amphibianobiodiversity',
    'birdrealbiodiversity',
    'amphibiarealbiodiversity',
    'reptilerealbiodiversity',
    'reptilenobiodiversity',
    'mammalnobiodiversity',
    'birdnobiodiversity',
    'mammalrealbiodiversity'
  ],
  'cl': [
    'tx',
    'pr',
    'ts',
    'tn'
  ],
  'eco': [
    'nbp',
    'gpp',
    'cVeg',
    'cSoil'
  ],
  'w': [
    'time_perc_change_SPI6',
    'perc_change_low_roff',
    'time_perc_change_SRI6',
    'river_floods_ExpDam',
    'river_floods_PopAff',
    'perc_change_roff',
    'time_perc_change_SPI48',
    'time_perc_change_SRI48'
  ]
};

const categories_indicators_map = {
  'bd': [
    'amphibianobiodiversity',
    'birdrealbiodiversity',
    'amphibiarealbiodiversity',
    'reptilerealbiodiversity',
    'reptilenobiodiversity',
    'mammalnobiodiversity',
    'birdnobiodiversity',
    'mammalrealbiodiversity'
  ],
  'cl': [
    'pr',
    'tx',
    'ts',
    'tn'
  ],
  'eco': [
    'nbp',
    'gpp',
    'cVeg',
    'cSoil'
  ],
  'w': [
    'time_perc_change_SPI6',
    'perc_change_low_roff',
    'time_perc_change_SRI6',
    'perc_change_roff',
    'time_perc_change_SPI48',
    'time_perc_change_SRI48'
  ]
};

const indicators_names_short = {
  'Maize_Irrigation_avoided_perc_change': 'Maize yield change avoided by irrigation',
  'Maize_yield_perc_change': 'Maize yield change',
  'Rice_Irrigation_avoided_perc_change': 'Rice yield change avoided by irrigation',
  'Rice_yield_perc_change': 'Rice yield change',
  'Soybeans_Irrigation_avoided_perc_change': 'Soybeans yield change avoided by irrigation',
  'Soybeans_yield_perc_change': 'Soybeans yield change',
  'Wheat_Irrigation_avoided_perc_change': 'Wheat yield change avoided by irrigation',
  'Wheat_yield_perc_change': 'Wheat yield change',
  'amphibianobiodiversity': 'Amphibian species richness remaining (without movement)',
  'amphibiarealbiodiversity': 'Amphibian species richness remaining (with movement)',
  'birdnobiodiversity': 'Bird species richness remaining (without movement)',
  'birdrealbiodiversity': 'Bird species richness remaining (with movement)',
  'evap': 'Evapotranspiration',
  'cSoil': 'Change in soil carbon content',
  'cVeg': 'Change in vegetation carbon content',
  'gpp': 'Change in gross primary productivity',
  'mammalnobiodiversity': 'Mammal species richness remaining (without movement)',
  'mammalrealbiodiversity': 'Mammal species richness remaining (with movement)',
  'nbp': 'Change in net biome productivity',
  'perc_change_low_roff': 'Change in low runoff (10th percentile)',
  'perc_change_roff': 'Change in average runoff',
  'pr': 'Precipitation',
  'reptilenobiodiversity': 'Reptile species richness remaining (without movement)',
  'reptilerealbiodiversity': 'Reptile species richness remaining (with movement)',
  'river_floods_ExpDam': 'Damage from river flooding',
  'river_floods_PopAff': 'Population affected by river flooding',
  'time_perc_change_SPI48': 'Change in time under meteorological drought (SPI48)',
  'time_perc_change_SPI6': 'Change in time under meteorological drought (SPI6)',
  'time_perc_change_SRI48': 'Change in time under hydrological drought (SRI48)',
  'time_perc_change_SRI6': 'Change in time under hydrological drought (SRI6)',
  'tn': 'Average minimum temperature',
  'tx': 'Average maximum temperature',
  'ts': 'Average temperature'
};

const indicators_names_long = {
  'Maize_Irrigation_avoided_perc_change': 'Change in maize crop yield avoided by irrigation in percent (%) relative to 1981–2010 levels.',
  'Maize_yield_perc_change': 'Change in maize yield in percent (%) relative to 1981–2010 levels.',
  'Rice_Irrigation_avoided_perc_change': 'Change in rice crop yield avoided by irrigation in percent (%) relative to 1981–2010 levels.',
  'Rice_yield_perc_change': 'Change in rice yield in percent (%) relative to 1981–2010 levels.',
  'Soybeans_Irrigation_avoided_perc_change': 'Change in soybean crop yield avoided by irrigation in percent (%) relative to 1981–2010 levels.',
  'Soybeans_yield_perc_change': 'Change in soybean yield in percent (%) relative to 1981–2010 levels.',
  'Wheat_Irrigation_avoided_perc_change': 'Change in wheat crop yield avoided by irrigation in percent (%) relative to 1981–2010 levels.',
  'Wheat_yield_perc_change': 'Change in wheat yield in percent (%) relative to 1981–2010 levels.',
  'amphibianobiodiversity': 'Amphibian species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location.',
  'amphibiarealbiodiversity': 'Amphibian species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time.',
  'birdnobiodiversity': 'Bird species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location.',
  'birdrealbiodiversity': 'Bird species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time.',
  'cSoil': 'Change in soil carbon content (kg m-2).',
  'cVeg': 'Change in vegetation carbon content (kg m-2).',
  'evap': 'Evapotranspiration (kg m-2 yr-1).',
  'gpp': 'Change in gross primary productivity (gC m-2 yr-1).',
  'mammalnobiodiversity': 'Mammal species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location.',
  'mammalrealbiodiversity': 'Mammal species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time.',
  'nbp': 'Change in net biome productivity (gC m-2 yr-1).',
  'perc_change_low_roff': 'Relative (%) change in low runoff (10th percentile), derived from daily data.',
  'perc_change_roff': 'Relative (%) change in average runoff, derived from daily data.',
  'pr': 'Precipitation (mm).',
  'reptilenobiodiversity': 'Reptile species richness remaining as a percent (%) relative to 1950–2000 levels, assuming no movement in species from their original location.',
  'reptilerealbiodiversity': 'Reptile species richness remaining as a percent (%) relative to 1950–2000 levels, including simulations of real movement in species ranges over time.',
  'river_floods_ExpDam': 'Direct expected damage per year by river flooding in Euros (in 2010 values) relative to baseline values (average 1976–2005), from multi-model averages based on EC-EARTH r1 to r7.',
  'river_floods_PopAff': 'The number of people affected per year by river flooding relative to baseline values (average 1976–2005), from multi-model averages based on EC-EARTH r1 to r7.',
  'time_perc_change_SPI48': 'Change in time under meteorological drought in percent (%), defined as the sum of months with 48-month Standardised Precipitation Index (SPI48) below the value -1.5, relative to the average over the baseline period of 1981-2010.',
  'time_perc_change_SPI6': 'Change in time under meteorological drought (SPI6) in percent (%), defined as the sum of months with 6-month Standardised Precipitation Index (SPI6) below the value -1.5, relative to the average over the baseline period of 1981-2010.',
  'time_perc_change_SRI48': 'Change in time under hydrological drought in percent (%), defined as the sum of months with 48-month Standardised Runoff Index (SRI48) below the value -1.5, relative to the average over the baseline period of 1981-2010.',
  'time_perc_change_SRI6': 'Change in time under hydrological drought in percent (%), defined as the sum of months with 6-month Standardised Runoff Index (SRI6) below the value -1.5, relative to the average over the baseline period of 1981-2010.',
  'tn': 'Annual average minimum temperature (degrees Celsius).',
  'ts': 'Annual average temperature (degrees Celsius).',
  'tx': 'Annual average maximum temperature (degrees Celsius).'
};

const indicators_labels = {
  'Maize_Irrigation_avoided_perc_change': 'Yield change avoided by irrigation (%)',
  'Maize_yield_perc_change': 'Yield change (%)',
  'Rice_Irrigation_avoided_perc_change': 'Yield change avoided by irrigation (%)',
  'Rice_yield_perc_change': 'Yield change (%)',
  'Soybeans_Irrigation_avoided_perc_change': 'Yield change avoided by irrigation (%)',
  'Soybeans_yield_perc_change': 'Yield change (%)',
  'Wheat_Irrigation_avoided_perc_change': 'Yield change avoided by irrigation (%)',
  'Wheat_yield_perc_change': 'Yield change (%)',
  'amphibianobiodiversity': 'Change in species richness (%)',
  'amphibiarealbiodiversity': 'Change in species richness (%)',
  'birdnobiodiversity': 'Change in species richness (%)',
  'birdrealbiodiversity': 'Change in species richness (%)',
  'cSoil': 'Change in soil carbon content (kg m-2)',
  'cVeg': 'Change in vegetation carbon content (kg m-2)',
  'evap': 'Evapotranspiration (kg m-2 yr-1)',
  'gpp': 'Change in gross primary productivity (gC m-2 yr-1)',
  'mammalnobiodiversity': 'Change in species richness (%)',
  'mammalrealbiodiversity': 'Change in species richness (%)',
  'nbp': 'Change in net biome productivity (gC m-2 yr-1)',
  'perc_change_low_roff': 'Change in low runoff (10th percentile) (%)',
  'perc_change_roff': 'Change in average runoff (%)',
  'pr': 'Precipitation (mm)',
  'reptilenobiodiversity': 'Change in species richness (%)',
  'reptilerealbiodiversity': 'Change in species richness (%)',
  'river_floods_ExpDam': 'Spending change on annual river flood damage (by value of Euro in 2010)',
  'river_floods_PopAff': 'Change in number people affected annually by river flooding (counts)',
  'time_perc_change_SPI48': 'Change in time under long-term meteorological drought conditions (%)',
  'time_perc_change_SPI6': 'Change in time under short-term meteorological drought conditions (%)',
  'time_perc_change_SRI48': 'Change in time under long-term hydrological drought conditions (%)',
  'time_perc_change_SRI6': 'Change in time under short-term hydrological drought conditions (%)',
  'tn': 'Minimum temperature (°C)',
  'ts': 'Mean temperature (°C)',
  'tx': 'Maximum temperature (°C)'
};

const indicators_units = {
  'Maize_Irrigation_avoided_perc_change': '%',
  'Maize_yield_perc_change': '%',
  'Rice_Irrigation_avoided_perc_change': '%',
  'Rice_yield_perc_change': '%',
  'Soybeans_Irrigation_avoided_perc_change': '%',
  'Soybeans_yield_perc_change': '%',
  'Wheat_Irrigation_avoided_perc_change': '%',
  'Wheat_yield_perc_change': '%',
  'amphibianobiodiversity': '%',
  'amphibiarealbiodiversity': '%',
  'birdnobiodiversity': '%',
  'birdrealbiodiversity': '%',
  'cSoil': 'kg m-2',
  'cVeg': 'kg m-2',
  'evap': 'kg m-2 yr-1',
  'gpp': 'gC m-2 yr-1',
  'mammalnobiodiversity': '%',
  'mammalrealbiodiversity': '%',
  'nbp': 'gC m-2 yr-1',
  'perc_change_low_roff': '%',
  'perc_change_roff': '%',
  'pr': 'mm',
  'reptilenobiodiversity': '%',
  'reptilerealbiodiversity': '%',
  'river_floods_ExpDam': '€ (2010 value)',
  'river_floods_PopAff': 'people',
  'time_perc_change_SPI48': '%',
  'time_perc_change_SPI6': '%',
  'time_perc_change_SRI48': '%',
  'time_perc_change_SRI6': '%',
  'tn': '°C',
  'ts': '°C',
  'tx': '°C',
  'swl': 'Temperature relative to pre-industrial levels (°C)'
};

const indicators_colorschemes = {
  'pr': ['#D6ECFC', '#BCECDC', '#70A9D2', '#5381D2', '#525FBD', '#3E39A1']
};

const indicators_buckets = {};

module.exports = {
  scenarios,
  measurements,
  categories,
  indicators_names_long,
  indicators_names_short,
  indicators_labels,
  indicators_units,
  categories_indicators_country,
  categories_indicators_map,
  indicators_colorschemes,
  indicators_buckets
};

/* eslint-enable quote-props,camelcase,max-len */
