import { connect } from 'react-redux';
import { ckmeans } from 'simple-statistics';

import { MAP_NUMBER_BUCKETS } from 'constants/map';
import MapsList from 'components/maps/MapsList';

const mapStateToProps = state => {
  const mapsList = state.maps.mapsList;
  const findMapsToCompare = (map) => (
    mapsList.filter((m) => (
      m.indicator.slug === map.indicator.slug &&
        m.measure.slug === map.measure.slug &&
        m.scenario.slug !== map.scenario.slug
    ))
  );

  return {
    maps: mapsList.map((map) => {
      const mapsToCompare = findMapsToCompare(map);
      const getBucket = ({ bucket }) => {
        const combineBuckets = (buckets) => {
          const mergeBuckets = buckets.reduce((acc, b) => acc.concat(b), []);
          const oneBucket = mergeBuckets.map((b) => b.value);
          const minValue = Math.min(...mergeBuckets.map((b) => b.minValue));

          return ckmeans(oneBucket, MAP_NUMBER_BUCKETS).map((c) => ({ value: c.slice(-1)[0], minValue }));
        };

        return bucket && bucket.length && mapsToCompare.length
          ? combineBuckets(mapsToCompare.map((m) => m.bucket).filter((m) => m).concat([bucket]))
          : bucket;
      };

      return {
        ...map,
        bucket: getBucket(map)
      };
    })
  };
};


export default connect(mapStateToProps, null)(MapsList);
