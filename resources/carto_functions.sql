
-- Function prepared to give all information available

DROP FUNCTION get_config(); 

CREATE OR REPLACE FUNCTION get_config() 
	RETURNS SETOF JSON as $$
	BEGIN
		RETURN QUERY EXECUTE 'with x as ( SELECT jsonb_build_object(''name'',indicator,''tableName'',table_name, ''slug'',indicator_slug, ''colorScheme'', color_scheme, ''units'', units) indicator, category, category_slug FROM master_table ),  f as (select  jsonb_agg(jsonb_build_object(''name'', category,''slug'',category_slug, ''indicator'', indicators)) as data from (SELECT jsonb_agg(indicator) indicators, category, category_slug FROM x group by category, category_slug) d) SELECT json_build_object(''categories'',data, ''scenarios'', json_build_array(jsonb_build_object(''name'',''1.5 °C'',''slug'',''15''),jsonb_build_object(''name'',''2 °C'',''slug'',''2''),jsonb_build_object(''name'',''4.5 °C'',''slug'',''45'')), ''measurements'',json_build_array(jsonb_build_object(''name'',''Maximum'',''slug'',''max''),jsonb_build_object(''name'',''Mean'',''slug'',''mean''),jsonb_build_object(''name'',''Minimum'',''slug'',''min''),jsonb_build_object(''name'',''Standard desviation'',''slug'',''sd''))) as data from f';
	END
$$ language 'plpgsql';


-- Function prepared to give all information to draw an indicator

DROP FUNCTION get_buckets(table_name TEXT, is_raster BOOLEAN, measure TEXT, scenario numeric, season int); 

DROP TYPE buckets;

CREATE TYPE buckets AS (raster_value numeric, raster_min numeric, nodatavalue numeric, value numeric);

CREATE OR REPLACE FUNCTION get_buckets(table_name TEXT, is_raster BOOLEAN, measure TEXT , scenario numeric , season int) 
	RETURNS SETOF buckets as $$
	DECLARE
	measures TEXT;
  	raster_table_name TEXT;
	BEGIN
		raster_table_name=table_name||'_'||measure||'_'||scenario::text||'_'||season::text||' ';
		IF is_raster IS TRUE then
			IF measure!='sd' then
				measures = 'default';
			else
				measures = 'sd';
			END IF;
			RETURN query EXECUTE 'with raster_min as (select min(unnest) as raster_min from (select unnest(ST_DumpValues(the_raster_webmercator,1, true))::numeric from o_1_'|| raster_table_name ||') r), statistics as (select min(unnest), max(unnest) from (select unnest(ST_DumpValues(the_raster_webmercator,1, true))::numeric from '|| raster_table_name ||') r), stats as ( select * from statistics, raster_min), data_selection as  (select jsonb_array_elements_text(value)::numeric as value from legend_config where table_name like '''|| table_name ||''' and measure like '''|| measures||'''), t as (select value,raster_min, min::numeric, max::numeric from stats, data_selection), nodatavalue as (SELECT (ST_BandMetaData(the_raster_webmercator, 1)).nodatavalue from  o_1_'|| raster_table_name ||' limit 1) select (((value-min)/(max-min))*(255-raster_min)+raster_min)::numeric as raster_value, raster_min::numeric, nodatavalue::numeric, value::numeric from t, nodatavalue';
		Else
			RETURN query EXECUTE 'with r as (select value, iso from '|| table_name ||' where measure like ''' || measure || ''' and scenario = '|| scenario ||' and season='|| season ||' ) SELECT null::numeric as raster_value, null::numeric as raster_min, null::numeric as nodatavalue, unnest(CDB_JenksBins(array_agg(distinct((value::numeric))), 6)) as value  from r group by nodatavalue';
		END IF;
	END
$$ language 'plpgsql';

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