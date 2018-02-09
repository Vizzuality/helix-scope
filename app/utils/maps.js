import trimEnd from 'lodash/trimEnd';

export function mapListToQueryString(mapList) {
  if (!mapList.length) return '';

  const query = mapList.reduce((q, map) => (
    `${q}${map.scenario.slug},${map.category.slug},${map.indicator.slug}/`
  ), '?maps=');

  return trimEnd(query, '/');
}
