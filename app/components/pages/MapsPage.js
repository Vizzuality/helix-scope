import React from 'react';

import { mapListToQueryString } from 'utils/maps';
import MapsListContainer from 'containers/maps/MapsListContainer';
import Button from 'components/common/Button';
import BasicMap from 'containers/maps/BasicMap';
import MapsModal from 'containers/modals/MapsModal';

class MapsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapModalOpen: props.maps.length === 0,
      mapSelectedId: null
    };
    this.setMapModal = this.setMapModal.bind(this);
    if (!this.props.config.loading && this.props.config) {
      this.setDefaultMapConfig(this.props.config);
    } else {
      this.defaultMapConfig = {
        scenario: {},
        category: {},
        indicator: {},
        layer: null
      };
    }
  }

  componentDidMount() {
    const { query, params, search } = this.context.location;

    if (query && query.maps) {
      this.props.saveParamsFromURL(query.maps, params);
    }
    if (!this.props.maps.length) {
      if (!this.props.config.loading) {
        this.props.initializeMaps();
      }
    } else {
      const queryFromMaps = mapListToQueryString(this.props.maps);

      // meaning we want to load new maps not use cached ones
      if (!!search && search !== queryFromMaps) {
        this.props.initializeMaps();
      } else {
        this.props.updateURL();
      }
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // // map params has been changed in URL
    if (nextProps.maps.length && nextContext.location.search) {
      const queryFromMaps = mapListToQueryString(nextProps.maps);
      const queryInURL = nextContext.location.search;

      if (queryFromMaps !== queryInURL) {
        const { query, params } = nextContext.location;
        nextProps.saveParamsFromURL(query.maps, params);
        this.props.initializeMaps();
      }
    }

    if (nextProps.maps.length === 0) {
      this.setMapModal(true);
    } else {
      this.setMapModal(false);
    }
    if (!nextProps.config.loading && nextProps.config !== this.props.config) {
      this.setDefaultMapConfig(nextProps.config);
      this.props.initializeMaps();
    }
  }

  setDefaultMapConfig(config) {
    this.defaultMapConfig = {
      scenario: config.scenarios[0],
      category: config.categories[0],
      indicator: config.categories[0].indicators[0]
    };
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

    const maps = mapsList.length === 0
      ? <BasicMap />
      : <MapsListContainer
        handleMapConfig={(id) => this.setMapConfigModal(id)}
        createLayer={this.props.createLayer}
      />;

    const selectedMap = this.props.maps.find((elem) => (
      elem.id === this.state.mapSelectedId
    ));
    const mapConfigData = selectedMap || this.defaultMapConfig;

    return (
      <div className="-dark">
        <div className="c-add-map">
          {addBtn}
        </div>
        {maps}
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
  initializeMaps: React.PropTypes.func,
  updateURL: React.PropTypes.func,
  saveParamsFromURL: React.PropTypes.func,
  maps: React.PropTypes.array,
  config: React.PropTypes.object,
  createLayer: React.PropTypes.func
};

export default MapsPage;
