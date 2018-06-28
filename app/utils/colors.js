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

function generateDivergedScheme(scheme1Generator, scheme2Generator) {
  return (nColors1, nColors2) => {
    const scheme1 = scheme1Generator(nColors1);
    const scheme2 = scheme2Generator(nColors2 + 1);

    return [...scheme1].concat(scheme2.splice(1));
  };
}

const BrGr = generateDivergedScheme(
  generateScheme('#8c510a', '#f6e8c3'),
  generateScheme('#f5f5f5', '#01665e')
);

const RdYlBl = generateDivergedScheme(
  generateScheme('#ff0000', '#ff7d00', '#ffb927', '#ffeb71'),
  generateScheme('#a2b5eb', '#8e89f3', '#6953fa', '#0000ff')
);

const BlYlRd = generateDivergedScheme(
  generateScheme('#0000ff', '#6953fa', '#8e89f3', '#a2b5eb'),
  generateScheme('#ffeb71', '#ffb927', '#ff7d00', '#ff0000')
);

const categoryColorScheme = {
  'bd': generateScheme('#F887F0', '#832685'),
  'w': generateScheme('#B3ECDD', '#383E9C'),
  'eco': generateScheme('#9DE644', '#00666B'),
  'ag': generateScheme('#FFF452', '#509131'),
  'cl': generateScheme('#FFF780', '#93001C')
};

const indicatorColorSchemeOverride = {
  'pr': generateScheme('#D6ECFC', '#3E39A1')
};

export const indicatorColorSchemeDivergedOverride = {
  'nbp': BrGr,
  'perc_change_roff': RdYlBl,
  'perc_change_low_roff': RdYlBl,
  'time_perc_change_SRI6': BlYlRd,
  'time_perc_change_SPI6': BlYlRd,
  'time_perc_change_SRI48': BlYlRd,
  'time_perc_change_SPI48': BlYlRd
};

export function getColorScheme(category, indicator, nColors) {
  return (
    indicatorColorSchemeOverride[indicator] || categoryColorScheme[category]
  )(nColors);
}

export function getColorSchemeByBuckets(category, indicator, buckets) {
  if (!buckets || !buckets.length) return [];

  const divergedScheme = indicatorColorSchemeDivergedOverride[indicator];

  if (divergedScheme) {
    const bucketValues = buckets.map(b => b.value);
    const scheme1ColorsNumber = bucketValues.filter(v => v <= 0).length;
    const scheme2ColorsNumber = bucketValues.filter(v => v > 0).length;

    return divergedScheme(scheme1ColorsNumber, scheme2ColorsNumber);
  }

  return getColorScheme(category, indicator, buckets.length);
}
