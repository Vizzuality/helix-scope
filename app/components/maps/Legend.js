import React from 'react';
import { categoryColorScheme } from 'constants/colors';

class Legend extends React.Component {
  shouldComponentUpdate(props) {
    const paramsChanged = props.mapData.bucket &&
      props.mapData.bucket.length > 0;

    return paramsChanged || true;
  }

  render() {
    const colors = categoryColorScheme[this.props.mapData.category.slug];

    if (this.props.mapData && !this.props.mapData.bucket) {
      return <div></div>;
    }

    const gradient = `linear-gradient(to right, ${colors.map((c, index) => `${c} ${(100 / (colors.length - 1)) * index}%`).join(', ')})`;
    return (
      <div className="c-legend">
        <ul className="labels">
          <div className="range" style={{ background: gradient }}></div>
          {this.props.mapData.bucket.map((bucket, index) =>
            bucket.value && (<li key={`legend-item-${index}`}>
              {parseFloat(bucket.value.toFixed(2))}
            </li>)
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
