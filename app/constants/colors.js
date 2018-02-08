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

export const categoryColorScheme = {
  'bd': generateScheme('#F887F0', '#832685'),
  'w': generateScheme('#B3ECDD', '#383E9C'),
  'eco': generateScheme('#9DE644', '#00666B'),
  'ag': generateScheme('#FFF452', '#509131'),
  'cl': generateScheme('#FFF780', '#93001C')
};

export const modelColors = [
  '#d36060',
  '#6bdfa1',
  '#8d43da',
  '#fbd24c'
];

// export const summaryLineColors = {
//   min: '#FCE64D',
//   mean: '#F29C30',
//   max: '#DD4414'
// };
