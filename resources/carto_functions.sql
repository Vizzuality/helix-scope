DROP FUNCTION get_config();

CREATE OR REPLACE FUNCTION get_config()
RETURNS SETOF JSONB as $fn$
BEGIN
  RETURN QUERY EXECUTE $q$
    WITH availability AS (
      SELECT variable, JSON_AGG(measurement) AS measurements
      FROM (
        SELECT variable, UNNEST(ARRAY[
          CASE WHEN nulls_min <> total_rows THEN 'min' END,
          CASE WHEN nulls_max <> total_rows THEN 'max' END,
          CASE WHEN nulls_mean <> total_rows THEN 'mean' END,
          CASE WHEN nulls_std <> total_rows THEN 'std' END
        ]) AS measurement
        FROM (
          SELECT variable,
            COUNT(*) - COUNT(min) AS nulls_min,
            COUNT(*) - COUNT(max) AS nulls_max,
            COUNT(*) - COUNT(std) AS nulls_std,
            COUNT(*) - COUNT(mean) AS nulls_mean,
            COUNT(*) AS total_rows
          FROM master_admin0
          GROUP BY variable
        ) nested
      ) filtered
      WHERE measurement IS NOT NULL
      GROUP BY variable
    )
    SELECT JSONB_BUILD_OBJECT(
      'scenarios', (
        SELECT JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'name', name,
            'short_name', short_name,
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
                'section', mci.section,
                'measurements', a.measurements
              )
            )
          )) AS json
          FROM meta_categories mc
          INNER JOIN meta_categories_indicators mci ON mc.cartodb_id = mci.category_id
          INNER JOIN meta_indicators mi ON mi.cartodb_id = mci.indicator_id
          INNER JOIN availability a ON a.variable = mi.slug
          GROUP BY mc.cartodb_id
        ) sub
      )
    )
  $q$;
END
$fn$ LANGUAGE 'plpgsql';

DROP FUNCTION get_buckets(variable TEXT, measure TEXT, scenario NUMERIC, buckets INTEGER)

CREATE OR REPLACE FUNCTION get_buckets(variable TEXT, measure TEXT, scenario NUMERIC, buckets INTEGER DEFAULT 6)
RETURNS TABLE(value NUMERIC) as $fn$
BEGIN
  RETURN QUERY EXECUTE $q$
    WITH data AS (
		  SELECT $q$||measure||$q$ AS value
      FROM master_admin0 m
      WHERE m.variable = $1
      AND m.swl_info = $2
      AND $q$||measure||$q$ IS NOT NULL
	  )
    SELECT UNNEST(
		  CDB_JenksBins(
			  ARRAY_AGG(
          DISTINCT(value::numeric)
        ), $3
      )
    ) AS value FROM data
  $q$
  USING variable, scenario, buckets;
END
$fn$ LANGUAGE 'plpgsql';

DROP FUNCTION get_country(iso text);

CREATE OR REPLACE FUNCTION get_country(iso TEXT)
RETURNS SETOF JSONB as $fn$
BEGIN
  RETURN QUERY EXECUTE $q$
    WITH step1 AS (
      SELECT m.swl_info AS scenario,
             m.variable AS variable,
             JSONB_BUILD_OBJECT(
               'model', m.model_taxonomy,
               'run', m.run,
               'max', m.max,
               'min', m.min,
               'mean', m.mean,
               'std', m.std
             ) AS measures
      FROM master_admin0 m
      WHERE m.iso = $1
    ), step2 AS (
      SELECT s1.variable, JSONB_BUILD_OBJECT(
        'scenario', s1.scenario,
        'measures', JSONB_AGG(s1.measures)
      ) AS data
      FROM step1 s1
      GROUP BY s1.scenario, s1.variable
    ), step3 AS (
      SELECT s2.variable, JSONB_AGG(s2.data) AS scenarios
      FROM step2 s2
      GROUP BY s2.variable
    ), step4 AS (
      SELECT JSONB_BUILD_OBJECT(
        'variable', s3.variable,
        'unit', mi.unit,
        'scenarios', s3.scenarios
      ) AS result
      FROM step3 s3
      INNER JOIN meta_indicators mi ON s3.variable = mi.slug
    )
    SELECT JSONB_AGG(result) FROM step4
  $q$
  USING iso;
END
$fn$ LANGUAGE 'plpgsql';
