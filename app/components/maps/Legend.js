import React from 'react';

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(props) {
    const paramsChanged = props.mapData.bucket &&
      props.mapData.bucket.length > 0;

    return paramsChanged;
  }

  render() {
    const colors = this.props.mapData.indicator.colorScheme;

    if (this.props.mapData && !this.props.mapData.bucket) {
      return <div></div>;
    }

    const gradient = `linear-gradient(to right, ${colors[0]}, ${colors[1]} 20%, ${colors[2]} 39%, ${colors[3]} 59%, ${colors[4]} 79%, ${colors[5]})`;

    return (
      <div className="c-legend">
        <ul className="labels">
          <div className="range" style={{ background: gradient }}></div>
          {this.props.mapData.bucket.map((bucket, index) =>
            <li key={`legend-item-${index}`}>
              {parseFloat(bucket.value.toFixed(2))}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

Legend.propTypes = {
  mapData: React.PropTypes.shape({
    indicator: React.PropTypes.object,
    bucket: React.PropTypes.array
  }).isRequired
};

export default Legend;
