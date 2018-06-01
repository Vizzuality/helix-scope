/* eslint-disable quote-props */
import chroma from 'chroma-js';

function generateColorScale(colors) {
  return chroma.bezier(colors)
    .scale()
    .correctLightness();
}

function generateScheme(...colors) {
  return (nColors) => generateColorScale(colors).colors(nColors);
}

const categoryColorScheme = {
  'bd': generateScheme('#F887F0', '#832685'),
  'w': generateScheme('#B3ECDD', '#383E9C'),
  'eco': generateScheme('#9DE644', '#00666B'),
  'ag': generateScheme('#FFF452', '#509131'),
  'cl': generateScheme('#FFF780', '#93001C')
};

const indicatorColorSchemeOverride = {
  'pr': generateScheme('#D6ECFC', '#3E39A1'),
  // below need to be corrected - we need a better diverging color palette centered on 0
  'time_perc_change_SRI6': generateScheme('#f45342', '#309eff'),
  'time_perc_change_SPI6': generateScheme('#f45342', '#309eff'),
  'time_perc_change_SRI48': generateScheme('#f45342', '#309eff'),
  'time_perc_change_SPI48': generateScheme('#f45342', '#309eff')
};

export function getColorScheme(category, indicator, nColors) {
  return (
    indicatorColorSchemeOverride[indicator] || categoryColorScheme[category]
  )(nColors);
}
