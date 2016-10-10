import React from 'react';
import { SEASON_LIST } from 'constants/season';

class SeasonSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.seasons = Object.assign([], SEASON_LIST);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    const mapData = this.props.mapData;
    mapData.season = parseInt(e.target.value, 10);
    this.props.setMapState(mapData);
  }

  render() {
    return (
      <div className="c-step-selector">
        <div className="list">
          {this.seasons.map((season) =>
            <div className="action" key={`season_${season.slug}`}>
              <input
                className="radio"
                id={`map_${this.props.mapData.id}_season_${season.slug}`}
                type="radio"
                name={`map_${this.props.mapData.id}_season_${season.slug}`}
                value={season.slug}
                checked={this.props.mapData.season === season.slug}
                onChange={this.onInputChange}
              />
              <label
                className={season.slug === this.props.mapData.season ? 'label -current' : 'label'}
                htmlFor={`map_${this.props.mapData.id}_season_${season.slug}`}
              >
                <span className="text">{season.name}</span>
              </label>
            </div>
          )}

        </div>
      </div>
    );
  }
}

SeasonSelector.propTypes = {
  mapData: React.PropTypes.shape({
    id: React.PropTypes.string,
    season: React.PropTypes.number
  }).isRequired,
  setMapState: React.PropTypes.func
};

export default SeasonSelector;
