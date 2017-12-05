import React from 'react';
import d3 from 'd3';
import { ENDPOINT_SQL } from 'constants/map';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { noData: false };
    this.timer = null;
  }

  componentDidMount() {
    if (this.props.data.scenarios && this.props.data.scenarios.length) {
      this.onPageResize = () => {
        this.debounceDraw();
      };
      window.addEventListener('resize', this.onPageResize);

      this.setScenarios();
      this.drawChart();
    } else {
      this.setState({ noData: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onPageResize);
  }

  setScenarios() {
    this.scenariosConfig = {};
    if (this.props.scenarios.length) {
      for (let i = 0, sLength = this.props.scenarios.length; i < sLength; i++) {
        this.scenariosConfig[this.props.scenarios[i].slug] = this.props.scenarios[i].name;
      }
    }
  }

  debounceDraw() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.drawChart();
    }, 200);
  }

  drawChart() {

  }

  render() {
    const downloadLink = `${ENDPOINT_SQL}?q=SELECT * FROM ${this.props.data.table_name} WHERE iso='${this.props.iso}'&format=csv`;
    return (
      <div className="c-chart">
        {!this.state.noData &&
          <a className="icon" href={downloadLink} target="_blank">
            <svg width="10" height="10" viewBox="0 0 16 16">
              <title>Download</title>
              <path
                d="M12.307 16H3.693a1 1 0 0 1-.936-.649L0 8h16l-2.757 7.351a1 1 0 0 1-.936.649zM4 3l4 4 4-4h-2V0H6v3H4z"
                fillRule="evenodd"
              />
            </svg>
          </a>
        }
        <div className="subtitle">{this.props.data.category}</div>
        <div className="title">{this.props.data.indicator}</div>
        {this.state.noData
          ? <div className="content subtitle">There is no data for this indicator</div>
          : <div className="chart" ref={ref => (this.chart = ref)}></div>
        }
      </div>
    );
  }
}

Chart.propTypes = {
  scenarios: React.PropTypes.array.isRequired,
  data: React.PropTypes.object.isRequired,
  iso: React.PropTypes.string.isRequired
};

export default Chart;
