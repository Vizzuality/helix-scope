
-- Function prepared to give all information available

DROP FUNCTION get_config();

CREATE OR REPLACE FUNCTION get_config()
	RETURNS SETOF JSON as $$
	BEGIN
		RETURN QUERY EXECUTE 'with x as ( SELECT jsonb_build_object(''name'',indicator,''tableName'',table_name, ''slug'',indicator_slug, ''colorScheme'', color_scheme, ''units'', units) indicator, category, category_slug FROM master_table ),  f as (select  jsonb_agg(jsonb_build_object(''name'', category,''slug'',category_slug, ''indicator'', indicators)) as data from (SELECT jsonb_agg(indicator) indicators, category, category_slug FROM x group by category, category_slug) d) SELECT json_build_object(''categories'',data, ''scenarios'', json_build_array(jsonb_build_object(''name'',''1.5 °C'',''slug'',''15''),jsonb_build_object(''name'',''2 °C'',''slug'',''2''),jsonb_build_object(''name'',''4.5 °C'',''slug'',''45'')), ''measurements'',json_build_array(jsonb_build_object(''name'',''Maximum'',''slug'',''max''),jsonb_build_object(''name'',''Mean'',''slug'',''mean''),jsonb_build_object(''name'',''Minimum'',''slug'',''min''),jsonb_build_object(''name'',''Standard deviation'',''slug'',''sd''))) as data from f';
	END
$$ language 'plpgsql';


-- Function prepared to give all information to draw an indicator

DROP FUNCTION get_buckets(variable TEXT, statistic TEXT, scenario NUMERIC)

CREATE OR REPLACE FUNCTION get_buckets(variable TEXT, statistic TEXT, scenario NUMERIC)
RETURNS TABLE(value NUMERIC) as $fn$
DECLARE
BEGIN
  RETURN QUERY EXECUTE $q$
    WITH DATA AS (
		  SELECT $q$||statistic||$q$ AS value
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
