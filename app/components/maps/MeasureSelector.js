import React from 'react';

class MeasureSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.measurements = this.props.measurements;
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    const mapData = this.props.mapData;
    mapData.measure = this.measurements.find((elem) => (
      elem.slug === e.target.value
    ));
    this.props.setMapState(mapData);
  }

  render() {
    return (
      <div className="c-step-selector">
        <div className="list">
          {this.measurements.map((measure) =>
            <div className="action" key={`measure_${measure.slug}`}>
              <input
                className="radio"
                id={`map_${this.props.mapData.id}_measure_${measure.slug}`}
                type="radio"
                name={`map_${this.props.mapData.id}_measure_${measure.slug}`}
                value={measure.slug}
                checked={this.props.mapData.measure.slug === measure.slug}
                onChange={this.onInputChange}
              />
              <label
                className={measure.slug === this.props.mapData.measure.slug ? 'label -current' : 'label'}
                htmlFor={`map_${this.props.mapData.id}_measure_${measure.slug}`}
              >
                <span className="text">{measure.slug}</span>
              </label>
            </div>
          )}

        </div>
      </div>
    );
  }
}

MeasureSelector.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    measure: React.PropTypes.object
  }).isRequired,
  setMapState: React.PropTypes.func,
  measurements: React.PropTypes.array
};

export default MeasureSelector;
