import React from 'react';

const Legend = (props) => {
  const colors = ['#D6ECFC', '#BCECDC', '#70A9D2', '#5381D2', '#525FBD', '#3E39A1'];

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
    bucket: React.PropTypes.array
  }).isRequired
};

export default Legend;
