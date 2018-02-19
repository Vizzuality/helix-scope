--

DROP TABLE IF EXISTS meta_scenarios;

CREATE TABLE meta_scenarios(
  name TEXT NOT NULL,
  slug TEXT NOT NULL
);

SELECT CDB_CARTODBFYTABLE('meta_scenarios');

DROP TABLE IF EXISTS meta_measurements;

CREATE TABLE meta_measurements(
  name TEXT NOT NULL,
  slug TEXT NOT NULL
);

SELECT CDB_CARTODBFYTABLE('meta_measurements');

DROP TABLE IF EXISTS meta_categories_indicators;

DROP TABLE IF EXISTS meta_categories;

CREATE TABLE meta_categories(
  name TEXT NOT NULL,
  slug TEXT NOT NULL
);

SELECT CDB_CARTODBFYTABLE('meta_categories');

DROP TABLE IF EXISTS meta_indicators;

CREATE TABLE meta_indicators(
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  name_long TEXT,
  unit TEXT,
  label TEXT,
  colorscheme JSON,
  buckets INTEGER
);

SELECT CDB_CARTODBFYTABLE('meta_indicators');

CREATE TABLE meta_categories_indicators(
  category_id INTEGER NOT NULL REFERENCES meta_categories(cartodb_id),
  indicator_id INTEGER NOT NULL REFERENCES meta_indicators(cartodb_id),
  section TEXT
);

SELECT CDB_CARTODBFYTABLE('meta_categories_indicators');
