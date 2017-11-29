-- Function prepared to give all information available

DROP FUNCTION get_config();

CREATE OR REPLACE FUNCTION get_config()
RETURNS SETOF JSONB as $fn$
BEGIN
  RETURN QUERY EXECUTE $q$
    SELECT JSONB_BUILD_OBJECT(
      'scenarios', (
        SELECT JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'name', name,
            'slug', slug
          )
        )
        FROM meta_scenarios ms
      ),
      'measurements', (
        SELECT JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'name', name,
            'slug', slug
          )
        )
        FROM meta_measurements
      ),
      'categories', (
        SELECT JSONB_AGG(sub.json)
        FROM (
          SELECT (JSONB_BUILD_OBJECT(
            'name', mc.name,
            'slug', mc.slug
          ) || JSONB_BUILD_OBJECT(
            'indicators', JSONB_AGG(
              JSONB_BUILD_OBJECT(
                'name', mi.name,
                'slug', mi.slug,
                'name_long', mi.name_long,
                'unit', mi.unit,
                'label', mi.label,
                'colorscheme', mi.colorscheme,
                'section', mci.section
              )
            )
          )) AS json
          FROM meta_categories mc
          INNER JOIN meta_categories_indicators mci ON mc.cartodb_id = mci.category_id
          INNER JOIN meta_indicators mi ON mi.cartodb_id = mci.indicator_id
          GROUP BY mc.cartodb_id
        ) sub
      )
    )
  $q$;
END
$fn$ LANGUAGE 'plpgsql';

-- Function prepared to give all information to draw an indicator

DROP FUNCTION get_buckets(variable TEXT, measure TEXT, scenario NUMERIC)

CREATE OR REPLACE FUNCTION get_buckets(variable TEXT, measure TEXT, scenario NUMERIC)
RETURNS TABLE(value NUMERIC) as $fn$
BEGIN
  RETURN QUERY EXECUTE $q$
    WITH data AS (
		  SELECT $q$||measure||$q$ AS value
      FROM master_admin0 m
      WHERE m.variable = $1
      AND m.swl_info = $2
	  )
    SELECT UNNEST(
		  CDB_JenksBins(
			  ARRAY_AGG(
          DISTINCT(value::numeric)
        ), 6
      )
    ) AS value FROM data
  $q$
  USING variable, scenario;
END
$fn$ LANGUAGE 'plpgsql';
-- select * from get_buckets('pr', 'mean', 1.5);

-- Function prepared to give all indicators from a country

DROP FUNCTION get_country(iso text);
DROP TYPE indicators;
CREATE TYPE indicators AS (category text, indicator text, table_name text, units text, data json);

CREATE OR REPLACE FUNCTION get_country(iso text)
	RETURNS SETOF indicators as $$
	DECLARE
	x text;
	BEGIN
		FOR x in select table_name from master_table where active is true
		LOOP
		RETURN query EXECUTE 'with r as (SELECT season, scenario, jsonb_object_agg(measure, value) measures FROM '||x||' where iso like '''||iso||''' group by scenario, season order by season, scenario), s as (select jsonb_object_agg(scenario, measures) as scenarios, season from r  group by season), data as ( select json_agg(jsonb_build_object(''scenarios'',scenarios, ''season'',season)) as data from s), result  as (select *, '''||x||'''::text as table_name from data) SELECT category::text, indicator::text, s.table_name::text, units::text, data FROM master_table s inner join result on result.table_name=s.table_name';
		END LOOP;
	END
$$ language 'plpgsql';
