const fetch = require('node-fetch');
const colors = require('cli-colors');

const cartodb = require('./cartodb.json')
const metadata = require('./metadata.js');

const DEFAULT_COLORSCHEME = ["#FFEEAE", "#FFB148", "#FF8324", "#F54B21", "#D90A54", "#8700AE"];
const DEFAULT_BUCKETS = 6;

const results = {};

const sql = function(statement, resultkey) {
  const url = `https://${cartodb.USERNAME}.carto.com/api/v2/sql`;
  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `api_key=${cartodb.APIKEY}&q=${encodeURIComponent(statement)}`
  }

  return fetch(url, opts)
    .then((res) => res.json())
    .then((json) => {
      if (json.error) {
        throw new Error(json.error)
      }
      console.log(`${colors.green(json.time.toString())} ${json.total_rows} ${statement}`);

      if (resultkey) {
        results[resultkey] = json.rows;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteAll = function() {
  return Promise.all([
    'meta_scenarios',
    'meta_measurements',
    'meta_categories_indicators',
    'meta_categories',
    'meta_indicators'
  ].map((table) =>  sql(`DELETE FROM ${table};`)));
}

const insertCommon = function() {
  return Promise.all([
    'scenarios',
    'measurements',
    'categories',
  ].map((table) => insertTable(table)));
}

const insertTable = function(table) {
  const values = Object.keys(metadata[table])
    .map((slug) => `('${slug}', '${metadata[table][slug]}')`);
  const statement = `INSERT INTO meta_${table}(slug, name) VALUES ${values.join(',')} RETURNING *`;

  return sql(statement, table);
}

const insertIndicators = function() {
  const indicators = Object.keys(metadata.indicators_names_short).map((indicator) => ({
    name: metadata.indicators_names_short[indicator],
    slug: indicator,
    name_long: metadata.indicators_names_long[indicator],
    unit: metadata.indicators_units[indicator],
    label: metadata.indicators_labels[indicator],
    colorscheme: metadata.indicators_colorschemes[indicator] || DEFAULT_COLORSCHEME,
    buckets: metadata.indicators_buckets[indicator] || DEFAULT_BUCKETS
  }));
  const values = indicators.map((i) => `('${i.name}', '${i.slug}', '${i.name_long}', '${i.unit}', '${i.label}', '[${i.colorscheme.map((c) => `"${c}"`)}]', ${i.buckets})`);
  const statement = `INSERT INTO meta_indicators(name, slug, name_long, unit, label, colorscheme, buckets) VALUES ${values.join(',')} RETURNING *`
  return sql(statement, 'indicators');
}

const insertCategoriesIndicators = function(type) {
  const pairs = [];
  const categories_indicators = metadata[`categories_indicators_${type}`];
  const indicators = Object.keys(categories_indicators)
    .forEach((category) =>
      categories_indicators[category].forEach((indicator) => {
        const category_id = results.categories.find((c) => c.slug == category).cartodb_id
        const indicator_id = results.indicators.find((i) => i.slug == indicator).cartodb_id
        pairs.push([category_id, indicator_id])
      }))
  const values = pairs.map((p) => `(${p[0]}, ${p[1]}, '${type}')`);
  const statement = `INSERT INTO meta_categories_indicators(category_id, indicator_id, section) VALUES ${values.join(',')}`;

  return sql(statement);
}

deleteAll()
  .then(() => insertCommon())
  .then(() => insertIndicators())
  .then(() => insertCategoriesIndicators('country'))
  .then(() => insertCategoriesIndicators('map'))
  .catch(console.error);
