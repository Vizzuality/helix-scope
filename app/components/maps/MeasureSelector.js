import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const MeasureSelector = ({ measure, measurements, onChange }) => {
  const handleChange = (e) => {
    const selectedMeasure = measurements.find((m) => m.slug === e.target.value);
    onChange(selectedMeasure);
  };
  const id = uuid();

  return (
    <div className="c-step-selector">
      <div className="list">
        {measurements.map((m) =>
          <div className="action" key={`measure_${m.slug}`}>
            <input
              className="radio"
              id={`${id}_measure_${m.slug}`}
              type="radio"
              name={`${id}_measure_${m.slug}`}
              value={m.slug}
              checked={measure.slug === m.slug}
              onChange={handleChange}
            />
            <label
              className={measure.slug === m.slug ? 'label -current' : 'label'}
              htmlFor={`${id}_measure_${m.slug}`}
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
  measure: PropTypes.object,
  onChange: PropTypes.func,
  measurements: PropTypes.array
};

export default MeasureSelector;
