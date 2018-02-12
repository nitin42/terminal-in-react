import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TerminalTopBar } from './styled-elements';

class Bar extends Component {
  static displayName = 'Bar';

  static propTypes = {
    style: PropTypes.object, // eslint-disable-line
    showActions: PropTypes.bool,
    handleMinimise: PropTypes.func,
    handleMaximise: PropTypes.func,
    handleClose: PropTypes.func,
  };

  static defaultProps = {
    style: {},
    showActions: true,
  };

  static contextTypes = {
    maximise: PropTypes.bool,
    toggleShow: PropTypes.func,
    toggleMinimize: PropTypes.func,
    toggleMaximise: PropTypes.func,
  };

  // Close the window
  handleClose = () => {
    if (this.props.handleClose) {
      this.props.handleClose(this.context.toggleShow);
    } else {
      this.context.toggleShow();
    }
  };

  // Minimise the window
  handleMinimise = () => {
    if (this.props.handleMinimise) {
      this.props.handleMinimise(this.context.toggleMinimize);
    } else {
      this.context.toggleMinimize();
    }
  };

  // Maximise the window
  handleMaximise = () => {
    if (this.props.handleMaximise) {
      this.props.handleMaximise(this.context.toggleMaximise);
    } else {
      this.context.toggleMaximise();
    }
  };

  render() {
    const { style, showActions } = this.props;
    return (
      <TerminalTopBar
        style={{
          ...style,
          ...(this.context.maximise ? { maxWidth: '100%' } : {}),
        }}
      >
        {showActions && (
          <svg height="20" width="100">
            <circle
              cx="24"
              cy="14"
              r="5"
              fill="red"
              style={{ cursor: 'pointer' }}
              onClick={this.handleClose}
            />
            <circle
              cx="44"
              cy="14"
              r="5"
              fill="orange"
              style={{ cursor: 'pointer' }}
              onClick={this.handleMinimise}
            />
            <circle
              cx="64"
              cy="14"
              r="5"
              fill="green"
              style={{ cursor: 'pointer' }}
              onClick={this.handleMaximise}
            />
          </svg>
        )}
      </TerminalTopBar>
    );
  }
}

export default Bar;
