import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Bar.css';

class Bar extends Component {
  static propTypes = {
    style: PropTypes.object, // eslint-disable-line
  };

  static defaultProps = {
    style: {},
  };

  render() {
    return (
      <div style={this.props.style} className="terminal-top-bar adjust-bar">
        <svg height="20" width="100">
          <circle cx="24" cy="14" r="5" fill="red" />
          <circle cx="44" cy="14" r="5" fill="orange" />
          <circle cx="64" cy="14" r="5" fill="green" />
        </svg>
      </div>
    );
  }
}

export default Bar;
