import React from 'react';
import PropTypes from 'prop-types';

import { formatSI } from 'utils/format';
import { getColorScheme } from 'utils/colors';
import {
  MAP_NUMBER_BUCKETS,
  MAP_LEGEND_MAX_TICKS
} from 'constants/map';

class Legend extends React.Component {
  shouldComponentUpdate(props) {
    const paramsChanged = props.mapData.bucket &&
      props.mapData.bucket.length > 0;

    return paramsChanged || true;
  }

  renderLegendValue(value, index, showValue = true) {
    const labelStyle = {
      width: `${100 / (MAP_NUMBER_BUCKETS + 1)}%`
    };

    return (
      <li style={labelStyle} key={`legend-item-${index}`}>
        {showValue && formatSI(value)}
      </li>
    );
  }

  render() {
    const { mapData } = this.props;
    const colors = getColorScheme(mapData.category.slug, mapData.indicator.slug, MAP_NUMBER_BUCKETS);

    if (!mapData || !mapData.bucket || !mapData.bucket.length) {
      return <div></div>;
    }

    const colorWidth = 100 / MAP_NUMBER_BUCKETS;
    const background = `linear-gradient(to right, ${colors.map((c, index) => `${c} ${colorWidth * index}%, ${c} ${colorWidth * (index + 1)}%`).join(', ')})`;

    const rangeStyle = {
      width: `${100 * MAP_NUMBER_BUCKETS / (MAP_NUMBER_BUCKETS + 1)}%`,
      background
    };
    const legendStyle = {
      width: `${100 * (MAP_NUMBER_BUCKETS + 1) / MAP_NUMBER_BUCKETS}%`,
      marginLeft: `-${100 / (MAP_NUMBER_BUCKETS * 2)}%`
    };
    const firstBucket = mapData.bucket[0].minValue;
    const lastBucket = mapData.bucket.slice(-1)[0];
    const restOfBuckets = mapData.bucket.slice(0, mapData.bucket.length - 1);
    const ticks = Math.min(MAP_NUMBER_BUCKETS + 1, MAP_LEGEND_MAX_TICKS) - 2; // without first and the last one
    const renderValueEvery = Math.ceil((MAP_NUMBER_BUCKETS - 1) / ticks);

    return (
      <div className="c-legend" style={legendStyle}>
        <div className="range" style={rangeStyle}></div>
        <ul className="labels">
          {this.renderLegendValue(firstBucket, 0)}
          {restOfBuckets.map((bucket, index) =>
            bucket.value && (
              this.renderLegendValue(bucket.value, index + 1, ((index + 1) % renderValueEvery === 0))
            )
          )}
          {this.renderLegendValue(lastBucket.value, mapData.bucket.length)}
        </ul>
      </div>
    );
  }
}

Legend.propTypes = {
  mapData: PropTypes.shape({
    indicator: PropTypes.object,
    category: PropTypes.object,
    bucket: PropTypes.array
  }).isRequired
};

export default Legend;
