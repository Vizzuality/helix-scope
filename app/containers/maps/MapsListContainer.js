import { connect } from 'react-redux';
import { ckmeans } from 'simple-statistics';

import { MAP_NUMBER_BUCKETS } from 'constants/map';
import MapsList from 'components/maps/MapsList';

const mapStateToProps = state => {
  const mapsList = state.maps.mapsList;
  const findMapsToCompare = (map) => (
    mapsList.filter((m) => (
      m.indicator.slug === map.indicator.slug &&
        m.scenario.slug !== map.scenario.slug
    ))
  );

  return {
    maps: mapsList.map((map) => {
      const mapsToCompare = findMapsToCompare(map);
      const combineBuckets = (buckets) => {
        const oneBucket = buckets.reduce((acc, b) => acc.concat(b), []);

        return ckmeans(oneBucket, MAP_NUMBER_BUCKETS).map((c) => c.slice(-1)[0]);
      };
      const getBuckets = ({ buckets }) => (
        buckets && buckets.length && mapsToCompare.length
          ? combineBuckets(mapsToCompare.map((m) => m.buckets).filter((m) => m).concat([buckets]))
          : buckets
      );
      const minValue = mapsToCompare.length
        ? Math.min(...[map.minValue, ...mapsToCompare.map(m => m.minValue)])
        : map.minValue;

      return {
        ...map,
        minValue,
        buckets: getBuckets(map)
      };
    })
  };
};


export default connect(mapStateToProps, null)(MapsList);
