import React from 'react';

const Legend = (props) => {
  const colors = props.mapData.indicator.colorScheme;

  if (props.mapData && !props.mapData.bucket) {
    return <div></div>;
  }

  return (
    <div className="scale">
      <ul className="labels">
        {props.mapData.bucket.map((bucket, index) =>
          <li key={`legend-item-${index}`}>
            <span style={{ backgroundColor: colors[index] }}></span>
            {bucket.value}
          </li>
        )}
      </ul>
    </div>
  );
};

Legend.propTypes = {
  mapData: React.PropTypes.shape({
    indicator: React.PropTypes.object,
    bucket: React.PropTypes.array
  }).isRequired
};

export default Legend;
