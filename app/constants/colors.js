/* eslint-disable quote-props */
import chroma from 'chroma-js';
import { MAP_NUMBER_BUCKETS } from './map';

function generateScheme(...colors) {
  return chroma.bezier(colors)
    .scale()
    .correctLightness()
    .colors(MAP_NUMBER_BUCKETS);
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
