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

  handleClose = () => {
    this.context.closeWindow();
    if (this.context.minimise) {
      this.context.closeOnMinMax();
    } else if (this.context.maximise) {
      this.context.closeOnMinMax();
    }
  };

  handleMinimise = () => {
    this.context.minimiseWindow();
    if (this.context.minimise) {
      this.context.undoMin();
    }
  };

  handleMaximise = () => {
    this.context.maximiseWindow();
    if (this.context.maximise) {
      this.context.undoMax();
    }
  };

  render() {
    return (
      <div
        style={
        (
          this.props.style,
          this.context.maximise ? { maxWidth: '100%' } : null
        )
        }
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

Bar.contextTypes = {
  minimise: PropTypes.bool,
  maximise: PropTypes.bool,
  closeWindow: PropTypes.func,
  minimiseWindow: PropTypes.func,
  undoMin: PropTypes.func,
  maximiseWindow: PropTypes.func,
  undoMax: PropTypes.func,
  closeOnMinMax: PropTypes.func,
};

export default Bar;
