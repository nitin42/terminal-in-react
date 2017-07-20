import React, { Component } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';

function last(arr) {
  return arr[arr.length - 1] || 'bash';
}

class Tabs extends Component {
  static displayName = 'Tabs';

  static propTypes = {
    style: PropTypes.object, // eslint-disable-line
    active: PropTypes.string,
    setActiveTab: PropTypes.func,
    removeTab: PropTypes.func,
    createTab: PropTypes.func,
  };

  static defaultProps = {
    style: {},
  };

  static contextTypes = {
    instances: PropTypes.array,
    maximise: PropTypes.bool,
  };

  handleBarClick = (e) => {
    e.stopPropagation();
    this.props.createTab();
  };

  // handle clicking a tab
  handleTabClick = (e, index) => {
    e.stopPropagation();
    this.props.setActiveTab(index);
  };

  handleRemoveClick = (e, index) => {
    e.stopPropagation();
    this.props.removeTab(index);
  };

  render() {
    const { style, active } = this.props;
    const tabs = this.context.instances.map(data => (
      <div
        key={data.index}
        className={`terminal-tab${active === data.index ? ' terminal-tab-active' : ''}`}
        onClick={e => this.handleTabClick(e, data.index)}
      >
        {(data.instance && data.instance.state) ? last(data.instance.state.summary) : 'bash'}
      </div>
    ));

    return (
      <div
        style={{
          ...style,
          ...(this.context.maximise ? { maxWidth: '100%' } : {}),
        }}
        className="terminal-tab-bar adjust-bar"
        onClick={this.handleBarClick}
      >
        {tabs}
      </div>
    );
  }
}

export default Tabs;
