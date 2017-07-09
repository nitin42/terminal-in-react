import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Content extends Component {
  static displayName = 'Content';

  // react/require-default-props 
  static propTypes = {
    backgroundColor: PropTypes.objectOf(PropTypes.string),
    output: PropTypes.arrayOf(PropTypes.element),
    prompt: PropTypes.objectOf(PropTypes.string),
    inputStyles: PropTypes.objectOf(PropTypes.string),
    handleChange: PropTypes.func,
    setHistoryCommand: PropTypes.func,
  };

  componentDidMount = () => {
    this.com.focus();
  };

  render() {
    const {
      backgroundColor,
      output,
      prompt,
      inputStyles,
      handleChange,
      setHistoryCommand,
    } = this.props;
    const { symbol, maximise } = this.context;
    return (
      <div
        className="terminal-container terminal-container-main"
        style={
        (
          backgroundColor,
          maximise ? { maxWidth: '100%' } : null
        )
        }
      >
        <div className="terminal-holder">
          <div className="terminal-content">
            <div className="terminal-input-area">
              {output}
              <p>
                <span className="terminal-prompt" style={prompt}>{symbol}</span>
                <input
                  className="terminal-main-input"
                  style={inputStyles}
                  type="text"
                  ref={com => (this.com = com)}
                  onKeyPress={handleChange}
                  onKeyDown={(e) => setHistoryCommand(e, this.com) }
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Content.contextTypes = {
  symbol: PropTypes.string,
  maximise: PropTypes.bool,
};

export default Content;
