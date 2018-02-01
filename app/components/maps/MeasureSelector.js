import React from 'react';

const MeasureSelector = ({ id, measure, measurements, onChange }) => {
  const handleChange = (e) => {
    const selectedMeasure = measurements.find((m) => m.slug === e.target.value);
    onChange(selectedMeasure);
  };

  return (
    <div className="c-step-selector">
      <div className="list">
        {measurements.map((m) =>
          <div className="action" key={`measure_${m.slug}`}>
            <input
              className="radio"
              id={`map_${id}_measure_${m.slug}`}
              type="radio"
              name={`map_${id}_measure_${m.slug}`}
              value={measure.slug}
              checked={measure.slug === m.slug}
              onChange={handleChange}
            />
            <label
              className={measure.slug === m.slug ? 'label -current' : 'label'}
              htmlFor={`map_${id}_measure_${m.slug}`}
            >
              <span className="text">{m.slug}</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

MeasureSelector.propTypes = {
  id: React.PropTypes.string,
  measure: React.PropTypes.object,
  onChange: React.PropTypes.func,
  measurements: React.PropTypes.array
};

export default MeasureSelector;
