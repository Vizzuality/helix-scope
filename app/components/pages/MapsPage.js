import React from 'react';
import MapsListContainer from 'containers/maps/MapsListContainer';
import Button from 'components/common/Button';
import MapsModal from 'components/modals/MapsModal';

class MapsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapModalOpen: false,
      mapSelectedId: null
    };
    this.handleSetMapModal = this.handleSetMapModal.bind(this);
    this.defaultMapConfig = {
      scenario: '0',
      category: 'climate',
      indicator: 'avg-precipitation',
      measure: 'standard-desviation'
    };
  }

  componentDidMount() {
    const { query } = this.context.location;

    if (query && query.maps) {
      this.props.setParamsFromURL(query.maps);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.maps.length === 0) {
      this.setState({
        mapModalOpen: true
      });
    }
  }

  setMapConfigModal(id) {
    this.setState({
      mapModalOpen: true,
      mapSelectedId: id
    });
  }

  handleSetMapModal(status) {
    this.setState({
      mapModalOpen: status
    });
  }

  render() {
    let addBtn;
    const mapsList = this.props.maps;
    if (mapsList.length < 4) {
      addBtn = <Button icon="plus-big" style="primary" size="large" onClick={() => this.setMapConfigModal(null)} />;
    }

    const mapConfigData = this.state.mapSelectedId
      ? this.props.maps[this.state.mapSelectedId]
      // default map config
      : this.defaultMapConfig;
    return (
      <div className="-dark">
        <div className="c-add-map">
          {addBtn}
        </div>
        <MapsListContainer
          maps={this.props.maps}
          latLng={this.props.latLng}
          zoom={this.props.zoom}
          handleMapConfig={(id) => this.setMapConfigModal(id)}
          deleteMap={this.props.deleteMap}
        />
        <MapsModal
          config={this.props.config}
          mapConfigData={mapConfigData}
          mapSelectedId={this.state.mapSelectedId}
          mapModalOpen={this.state.mapModalOpen}
          onSetMapModal={this.handleSetMapModal}
          setMapState={this.props.setMap}
        />
      </div>
    );
  }
}

MapsPage.contextTypes = {
  location: React.PropTypes.object
};

MapsPage.propTypes = {
  onSetMapModal: React.PropTypes.func,
  setParamsFromURL: React.PropTypes.func,
  maps: React.PropTypes.array,
  latLng: React.PropTypes.object,
  zoom: React.PropTypes.number,
  config: React.PropTypes.object.isRequired,
  setMap: React.PropTypes.func,
  deleteMap: React.PropTypes.func
};

export default MapsPage;
