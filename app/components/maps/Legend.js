import React from 'react';
import { categoryColorScheme } from 'constants/colors';
import { MAP_NUMBER_BUCKETS } from 'constants/map';

class Legend extends React.Component {
  shouldComponentUpdate(props) {
    const paramsChanged = props.mapData.bucket &&
      props.mapData.bucket.length > 0;

    return paramsChanged || true;
  }

  render() {
    const { mapData } = this.props;
    const colors = categoryColorScheme[mapData.category.slug];

    if (!mapData || !mapData.bucket || !mapData.bucket.length) {
      return <div></div>;
    }

    const perc = 100 / (colors.length - 1);
    const background = `linear-gradient(to right, ${colors.map((c, index) => `${c} ${perc * index}%`).join(', ')})`;
    /* const background = `linear-gradient(to right, ${colors.map((c, index) => `${c} ${perc * index}%, ${c} ${perc * (index + 1)}%`).join(', ')})`;*/
    const rangeStyle = {
      width: `${100 * MAP_NUMBER_BUCKETS / (MAP_NUMBER_BUCKETS + 1)}%`,
      background
    };
    const legendStyle = {
      width: `${100 * (MAP_NUMBER_BUCKETS + 1) / MAP_NUMBER_BUCKETS}%`,
      marginLeft: `-${100 / (MAP_NUMBER_BUCKETS * 2)}%`
    };
    const labelStyle = {
      width: `${100 / (MAP_NUMBER_BUCKETS + 1)}%`
    };
    const legendValue = (value, index) => ((
      <li style={labelStyle} key={`legend-item-${index}`}>
        {value.toFixed(1)}
      </li>
    ));

    return (
      <div className="c-legend" style={legendStyle}>
        <div className="range" style={rangeStyle}></div>
        <ul className="labels">
          {legendValue(mapData.bucket[0].minValue, 0)}
          {mapData.bucket.map((bucket, index) =>
            bucket.value && (
              legendValue(bucket.value, index + 1)
            )
          )}
        </ul>
      </div>
    );
  }
}

Legend.propTypes = {
  mapData: React.PropTypes.shape({
    indicator: React.PropTypes.object,
    category: React.PropTypes.object,
    bucket: React.PropTypes.array
  }).isRequired
};

export default Legend;
