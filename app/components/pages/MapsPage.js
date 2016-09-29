import React from 'react';
import MapsListContainer from 'containers/maps/MapsListContainer';
import Button from 'components/common/Button';
import MapsModal from 'containers/modals/MapsModal';

class MapsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapModalOpen: true,
      mapSelectedId: null
    };
    this.setMapModal = this.setMapModal.bind(this);
    this.defaultMapConfig = {
      scenario: {},
      category: {},
      indicator: {},
      measure: {},
      layer: null
    };
  }

  componentDidMount() {
    const { query } = this.context.location;

    if (query && query.maps) {
      this.props.saveParamsFromURL(query.maps);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.maps.length === 0) {
      this.setMapModal(true);
    } else {
      this.setMapModal(false);
    }
    if (!nextProps.config.loading && nextProps.config !== this.props.config) {
      this.defaultMapConfig = {
        scenario: nextProps.config.scenarios[0],
        category: nextProps.config.categories[0],
        indicator: nextProps.config.categories[0].indicator[0],
        measure: nextProps.config.measurements[0]
      };
    }
  }

  setMapConfigModal(id) {
    this.setState({
      mapModalOpen: true,
      mapSelectedId: id
    });
  }

  setMapModal(status) {
    this.setState({
      mapModalOpen: status
    });
  }

  render() {
    if (this.props.config.loading) return null;

    let addBtn;
    const mapsList = this.props.maps;
    if (mapsList.length < 4) {
      addBtn = <Button icon="plus-big" style="primary" size="large" onClick={() => this.setMapConfigModal(null)} />;
    }

    const selectedMap = this.props.maps.find((elem) => (
      elem.id === this.state.mapSelectedId
    ));
    const mapConfigData = selectedMap || this.defaultMapConfig;

    return (
      <div className="-dark">
        <div className="c-add-map">
          {addBtn}
        </div>
        <MapsListContainer
          handleMapConfig={(id) => this.setMapConfigModal(id)}
          createLayer={this.props.createLayer}
        />
        <MapsModal
          mapConfigData={mapConfigData}
          mapSelectedId={this.state.mapSelectedId}
          mapModalOpen={this.state.mapModalOpen}
          onSetMapModal={this.setMapModal}
        />
      </div>
    );
  }
}

MapsPage.contextTypes = {
  location: React.PropTypes.object
};

MapsPage.propTypes = {
  saveParamsFromURL: React.PropTypes.func,
  maps: React.PropTypes.array,
  config: React.PropTypes.object,
  createLayer: React.PropTypes.func
};

export default MapsPage;
