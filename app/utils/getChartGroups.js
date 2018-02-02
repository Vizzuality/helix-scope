import React from 'react';
import get from 'lodash/get';
import uniq from 'lodash/uniqBy';
import flatMap from 'lodash/flatMap';

import InterQuartileRangeChart from 'containers/charts/InterQuartileRange';
import RegularBarChart from 'containers/charts/RegularBar';
import BoxAndWhiskersChart from 'containers/charts/BoxAndWhiskers';
import {
  maizeVariables,
  irrigationVariables
} from 'constants/country';

function cropYieldDynamicInfo(data) {
  const models = get(data, '[0].models');
  const institutions = get(data, '[0].institutions');

  return `
    These data were created using the ${models} models of the ${institutions}.
    All yield values are relative to average yields over a baseline period of 1981–2010.
  `;
}

function climatologicalDynamicInfo(measurement, variable, data) {
  const filtered = (data || []).filter((d) => d.variable === variable.slug);
  const models = uniq(flatMap(filtered, (d) => d.models)).join(', ');
  const institutions = uniq(flatMap(filtered, (d) => d.institutions)).join(', ');

  return `
    ${measurement} of ${variable.name} over the country wide area: ${variable.name_long}.
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

export default function getChartGroups(category, country) {
  const onlyForCountry = (i) => i.section === 'country';

  switch (category.slug) {
    case 'ag':
      return [
        {
          slug: 'crop_yield_change_baseline',
          label: 'Projected changes in crop yields relative to 1981–2010 base-level (%)',
          charts: [{
            info: cropYieldDynamicInfo,
            component: (
              <InterQuartileRangeChart
                iso={country.iso}
                chart="crop_yield_change_baseline"
                variables={maizeVariables}
              />
            )
          }]
        },
        {
          slug: 'crop_yield_change_irrigation',
          label: 'Change in crop yields (relative to 1981-2010 base levels) avoided under different warming scenarios due to Irrigation (%)',
          charts: [{
            info: cropYieldDynamicInfo,
            component: (
              <InterQuartileRangeChart
                iso={country.iso}
                chart="crop_yield_change_irrigation"
                variables={irrigationVariables}
              />
            )
          }]
        }
      ];
    case 'cl':
    case 'eco':
    case 'bd':
      return category.indicators.filter(onlyForCountry).map((i) => ({
        ...i,
        slug: 'climatological_ecological',
        label: `${i.name} (${i.unit})`,
        charts: i.measurements.map((m) => ({
          measurement: m,
          info: climatologicalDynamicInfo.bind(null, m, i),
          component: (
            <BoxAndWhiskersChart
              iso={country.iso}
              chart="climatological_ecological"
              variable={i.slug}
              value={m}
            />
          )
        }))
      }));
    case 'w':
      return [
        {
          slug: 'annual_expected_flood_damage',
          label: 'Annual expected flood damages relative to 1976–2005 levels (millions of €)',
          charts: [{
            info: floodCostDynamicInfo,
            component: (
              <RegularBarChart
                iso={country.iso}
                chart="annual_expected_flood_damage"
              />
            )
          }]
        },
        {
          slug: 'population_affected_anually',
          label: 'Population affected annually year from river flooding relative to 1976–2005 levels',
          charts: [{
            info: floodAffDynamicInfo,
            component: (
              <RegularBarChart
                iso={country.iso}
                chart="population_affected_anually"
              />
            )
          }]
        }
      ];
    default:
      return [];
  }
}
