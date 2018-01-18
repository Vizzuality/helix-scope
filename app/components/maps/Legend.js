import React from 'react';

class Legend extends React.Component {
  shouldComponentUpdate(props) {
    const paramsChanged = props.mapData.bucket &&
      props.mapData.bucket.length > 0;

    return paramsChanged || true;
  }

  render() {
    const colors = this.props.mapData.indicator.colorscheme;
    const percentages = ['', '20%', '39%', '59%', '79%', ''];

    if (this.props.mapData && !this.props.mapData.bucket) {
      return <div></div>;
    }

    const gradient = `linear-gradient(to left, ${percentages.map((p, n) => `${colors[n]} ${p}`).join(', ')})`;
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
    bucket: React.PropTypes.array
  }).isRequired
};

export default Legend;
