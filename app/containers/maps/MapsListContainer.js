import { connect } from 'react-redux';
import { ckmeans } from 'simple-statistics';

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
          const oneBucket = buckets
                .reduce((acc, b) => acc.concat(b), [])
                .map((b) => b.value);
          return ckmeans(oneBucket, 6).map((c) => ({ value: c.slice(-1)[0] }));
        };

        return bucket && mapsToCompare.length
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
