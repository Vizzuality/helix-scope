import get from 'lodash/get';
import uniq from 'lodash/uniqBy';
import flatMap from 'lodash/flatMap';
import flatten from 'lodash/flatten';

function removeLastDot(str) {
  return str.replace(/\.\s*$/, '');
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const onlyForCountry = (i) => i.section === 'country';

function cropYieldDynamicInfo(data) {
  const models = get(data, '[0].models');
  const institutions = get(data, '[0].institutions');

  return `
    These data were created using the ${models} models of the ${institutions}.
    All yield values are relative to average yields over a baseline period of 1981–2010.
  `;
}

function climatologicalDynamicInfo(variable, data, measurement) {
  const filtered = (data || []).filter((d) => d.variable === variable.slug);
  const models = uniq(flatMap(filtered, (d) => d.models)).join(', ');
  const institutions = uniq(flatMap(filtered, (d) => d.institutions)).join(', ');

  return `
    ${capitalize(measurement)} of ${variable.name} over the country wide area: ${removeLastDot(variable.name_long)}.
    These data are obtained from ${models} models, processed by ${institutions}.
  `;
}

function floodCostDynamicInfo(data) {
  const models = uniq(flatMap(data, (d) => d.model)).join(', ');
  const institutions = uniq(flatMap(data, (d) => d.institution)).join(', ');

  return `
    These data were produced by the ${models} model, of the ${institutions}. Values are relative to avearges over the 1976–2005 period.
    Expected damages are annual estimated cost of flooding, estimated in millions of € (relative to 2010 value).
  `;
}

function floodAffDynamicInfo(data) {
  const models = uniq(flatMap(data, (d) => d.model)).join(', ');
  const institutions = uniq(flatMap(data, (d) => d.institution)).join(', ');

  return `
    These data were produced by the ${models}, of the ${institutions}. Values are relative to avearges over the 1976–2005 period.
    The data show the estimated number of people affected annually by river flooding, relative to 1976–2010 values.
  `;
}

function getClimatologicalCharts(category) {
  return category.indicators.filter(onlyForCountry).map((i) => ({
    slug: 'climatological_ecological',
    measurements: i.measurements,
    label: `${i.name} (${i.unit})`,
    variable: i.slug,
    info: climatologicalDynamicInfo.bind(null, i)
  }));
}

function getSummaryCharts(category) {
  const notTemperature = (i) => !['tn', 'tx', 'ts'].includes(i.slug);

  return category
    .indicators
    .filter(onlyForCountry)
    .filter(notTemperature)
    .map((i) => ({
      slug: `${i.slug}_summary`,
      label: `${i.name} - Summary (${i.unit})`,
      variable: i.slug,
      info: () => {}
    }));
}

export function getChartsByCategory(category) {
  switch (category.slug) {
    case 'ag':
      return [
        {
          slug: 'crop_yield_change_baseline',
          variable: 'yield',
          label: 'Projected changes in crop yields relative to 1981–2010 base-level (%)',
          info: cropYieldDynamicInfo
        },
        {
          slug: 'crop_yield_change_irrigation',
          variable: 'Irrigation',
          label: 'Change in crop yields (relative to 1981-2010 base levels) avoided under different warming scenarios due to Irrigation (%)',
          info: cropYieldDynamicInfo
        }
      ];
    case 'cl':
    case 'eco':
    case 'bd':
      return flatten([
        getClimatologicalCharts(category),
        {
          slug: 'temperature_summary',
          label: 'Average Temperature - Summary (°C)',
          info: () => {}
        },
        getSummaryCharts(category)
      ]);
    case 'w':
      return [
        {
          slug: 'annual_expected_flood_damage',
          label: 'Annual expected flood damages relative to 1976–2005 levels (millions of €)',
          variable: 'river_floods_ExpDam',
          info: floodCostDynamicInfo
        },
        {
          slug: 'population_affected_anually',
          label: 'Population affected annually year from river flooding relative to 1976–2005 levels',
          variable: 'river_floods_PopAff',
          info: floodAffDynamicInfo
        }
      ];
    default:
      return [];
  }
}