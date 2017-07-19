import React, { Component } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';

class Content extends Component {
  static displayName = 'Content';

  static propTypes = {
    backgroundColor: PropTypes.objectOf(PropTypes.string),
    prompt: PropTypes.objectOf(PropTypes.string),
    inputStyles: PropTypes.objectOf(PropTypes.string),
    register: PropTypes.func,
    handleChange: PropTypes.func,
    handlerKeyPress: PropTypes.func.isRequired,
  };

  static contextTypes = {
    symbol: PropTypes.string,
    maximise: PropTypes.bool,
  };

  state = {
    summary: [],
    promptPrefix: '',
    history: [],
    historyCounter: 0,
    input: [],
    keyInputs: [],
  };

  componentDidMount = () => {
    this.focusInput();
    this.unregister = this.props.register(this);
  };

  // Adjust scrolling
  componentDidUpdate = () => {
    if (this.inputWrapper !== null) {
      this.inputWrapper.scrollIntoView(false);
    }
  };

  componentWillUnmount() {
    this.unregister();
  }

  focusInput = () => {
    if (this.com !== null) {
      this.com.focus();
    }
  };

  handleChange = (e) => {
    this.props.handleChange(this, e);
  }

  handleKeyPress = (e) => {
    this.props.handlerKeyPress(this, e, this.com);
  }

  render() {
    const { prompt, inputStyles, backgroundColor } = this.props;
    const { symbol, maximise } = this.context;

    const output = this.state.summary.map((content, i) => {
      if (typeof content === 'string' && content.length === 0) {
        return <div className="terminal-output-line" key={i}>&nbsp;</div>;
      }
      return <pre className="terminal-output-line" key={i}>{content}</pre>;
    });

    return (
      <div
        className="terminal-container terminal-container-main"
        style={{
          ...backgroundColor,
          ...(maximise
            ? { maxWidth: '100%', maxHeight: 'calc(100% - 30px)' }
            : {}),
        }}
        onClick={this.focusInput}
      >
        <div className="terminal-holder">
          <div className="terminal-content">
            <div className="terminal-input-area">
              {output}
              <div
                className="terminal-input"
                ref={elm => (this.inputWrapper = elm)}
              >
                <span className="terminal-prompt" style={prompt}>
                  {this.state.promptPrefix + symbol}
                </span>
                <input
                  className="terminal-main-input"
                  style={inputStyles}
                  type="text"
                  tabIndex="-1"
                  ref={com => (this.com = com)}
                  onKeyPress={this.handleChange}
                  onKeyDown={this.handleKeyPress}
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
