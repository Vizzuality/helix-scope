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
