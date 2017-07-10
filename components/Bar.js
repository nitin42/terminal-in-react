import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Bar.css';

class Bar extends Component {
  static displayName = 'Bar';

  static propTypes = {
    style: PropTypes.object // eslint-disable-line
  };

  static defaultProps = {
    style: {},
  };

  static contextTypes = {
    maximise: PropTypes.bool,
    toggleShow: PropTypes.func,
    toggleMinimize: PropTypes.func,
    toggleMaximise: PropTypes.func,
  };

  // Close the window
  handleClose = () => {
    this.context.toggleShow();
  };

  // Minimise the window
  handleMinimise = () => {
    this.context.toggleMinimize();
  };

  // Maximise the window
  handleMaximise = () => {
    this.context.toggleMaximise();
  };

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          ...(this.context.maximise ? { maxWidth: '100%' } : {}),
        }}
        className="terminal-top-bar adjust-bar"
      >
        <svg height="20" width="100">
          <circle cx="24" cy="14" r="5" fill="red" onClick={this.handleClose} />
          <circle
            cx="44"
            cy="14"
            r="5"
            fill="orange"
            onClick={this.handleMinimise}
          />
          <circle
            cx="64"
            cy="14"
            r="5"
            fill="green"
            onClick={this.handleMaximise}
          />
        </svg>
      </div>
    );
  }
}

export default Bar;
