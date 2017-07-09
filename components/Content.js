import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Content extends Component {
  static displayName = 'Content';

  static propTypes = {
    backgroundColor: PropTypes.objectOf(PropTypes.string),
    output: PropTypes.arrayOf(PropTypes.element),
    prompt: PropTypes.objectOf(PropTypes.string),
    inputStyles: PropTypes.objectOf(PropTypes.string),
    handleChange: PropTypes.func,
    setHistoryCommand: PropTypes.func,
  };

  static contextTypes = {
    symbol: PropTypes.string,
    maximise: PropTypes.bool,
  };

  componentDidMount = () => {
    this.focusInput();
  };

  componentDidUpdate = () => {
    this.inputWrapper.scrollIntoView(false);
  }

  focusInput = () => {
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
        style={(
          backgroundColor,
          maximise ? { maxWidth: '100%', maxHeight: 'calc(100% - 30px)' } : null
        )}
        onClick={this.focusInput}
      >
        <div className="terminal-holder">
          <div className="terminal-content">
            <div className="terminal-input-area">
              {output}
              <div className="terminal-input" ref={elm => (this.inputWrapper = elm)}>
                <span className="terminal-prompt" style={prompt}>{symbol}</span>
                <input
                  className="terminal-main-input"
                  style={inputStyles}
                  type="text"
                  ref={com => (this.com = com)}
                  onKeyPress={handleChange}
                  onKeyDown={e => setHistoryCommand(e, this.com)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
