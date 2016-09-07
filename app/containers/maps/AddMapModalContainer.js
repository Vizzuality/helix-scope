import { connect } from 'react-redux';
import MapsPage from 'components/maps/AddModal';
import { addMap, hideAddMapModal, setScenario, setIndicatorsCategory, setIndicator } from '../../actions/maps';

const mapStateToProps = state => {
  const selectedIndicators = state.config.indicators.filter(indicator => {
    return indicator.categorySlug === state.mapConfig.selectedIndicatorCategorySlug;
  });
  const p = {
    selectedIndicators,
    scenarios: state.config.scenarios,
    indicatorsCategories: state.config.indicatorsCategories,
    selectedScenario: state.mapConfig.selectedScenario
  };
  return p;
};

const mapDispatchToProps = (dispatch, props) => ({
  onAddClick: () => {
    dispatch(addMap(props.routeParams, props.routePath));
  },
  onHideModal: () => {
    dispatch(hideAddMapModal(props.routeParams, props.routePath));
  },
  onScenarioChange: event => {
    dispatch(setScenario(event.target.value));
  },
  onIndicatorsCategoryChange: event => {
    dispatch(setIndicatorsCategory(event.slug));
  },
  onIndicatorChange: event => {
    dispatch(setIndicator(event.slug));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MapsPage);
