import React from 'react';
import MapsListContainer from 'containers/maps/MapsListContainer';
import Button from 'components/common/Button';
import MapsModal from 'containers/modals/MapsModal';

class MapsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapModalOpen: false,
      mapSelectedId: null
    };
    this.setMapModal = this.setMapModal.bind(this);
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
      this.setMapModal(true);
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
          handleMapConfig={(id) => this.setMapConfigModal(id)}
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
  setParamsFromURL: React.PropTypes.func,
  maps: React.PropTypes.array
};

export default MapsPage;
