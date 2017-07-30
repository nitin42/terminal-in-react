import React, { Component } from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import whatkey, { unprintableKeys } from 'whatkey';

class Content extends Component {
  static displayName = 'Content';

  static propTypes = {
    id: PropTypes.string,
    oldData: PropTypes.object, // eslint-disable-line
    backgroundColor: PropTypes.objectOf(PropTypes.string),
    prompt: PropTypes.objectOf(PropTypes.string),
    inputStyles: PropTypes.objectOf(PropTypes.string),
    register: PropTypes.func,
    handleChange: PropTypes.func,
    handlerKeyPress: PropTypes.func.isRequired,
  };

  static defaultProps = {
    oldData: {},
  };

  static contextTypes = {
    symbol: PropTypes.string,
    maximise: PropTypes.bool,
    instances: PropTypes.array,
    activeTab: PropTypes.string,
    barShowing: PropTypes.bool,
    tabsShowing: PropTypes.bool,
  };

  state = {
    summary: [],
    promptPrefix: '',
    history: [],
    historyCounter: 0,
    input: [],
    keyInputs: [],
    canScroll: true,
  };

  componentWillMount = () => {
    const data = this.context.instances.find(i => i.index === this.props.id);
    if (data) {
      this.setState(data.oldData);
    }
  };

  componentDidMount = () => {
    this.focusInput();
    const data = this.context.instances.find(i => i.index === this.props.id);
    this.unregister = this.props.register(this);
    if (!data || Object.keys(data.oldData).length === 0) {
      this.handleChange({ target: { value: 'show' }, key: 'Enter', dontShowCommand: true });
    }
  };

  // Adjust scrolling
  componentDidUpdate = () => {
    if (this.inputWrapper !== null) {
      this.inputWrapper.scrollIntoView(false);
    }
  };

  componentWillUnmount() {
    this.unregister(this.state);
  }

  setScrollPosition = (pos) => {
    setTimeout(() => {
      if (this.contentWrapper !== null) {
        this.contentWrapper.scrollTop = pos;
      }
    }, 50);
  };

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

  handleOuterKeypress = (e) => {
    const key = whatkey(e).key;
    const actionKeys = ['up', 'down', 'left', 'right', 'enter'];
    if (unprintableKeys.indexOf(key) < 0) {
      if (document.activeElement !== this.com) {
        this.com.focus();
        this.com.value += whatkey(e).char;
      }
    } else if (actionKeys.indexOf(key) > -1) {
      this.com.focus();
    }
  }

  render() {
    const { prompt, inputStyles, backgroundColor, id } = this.props;
    const { symbol, maximise, activeTab, barShowing, tabsShowing } = this.context;

    if (id !== activeTab) {
      return null;
    }

    const output = this.state.summary.map((content, i) => {
      if (typeof content === 'string' && content.length === 0) {
        return <div className="terminal-output-line" key={i}>&nbsp;</div>;
      }
      return <pre className="terminal-output-line" key={i}>{content}</pre>;
    });

    let toSubtract = 30;
    if (!barShowing) {
      toSubtract -= 30;
    }
    if (tabsShowing) {
      toSubtract += 30;
    }

    return (
      <div
        className="terminal-container terminal-container-main"
        style={{
          ...backgroundColor,
          ...(maximise
            ? { maxWidth: '100%', maxHeight: `calc(100% - ${toSubtract}px)` }
            : {}),
          ...(this.state.canScroll
            ? { overflowY: 'auto' }
            : { overflowY: 'hidden' }),
        }}
        tabIndex="0"
        onKeyUp={this.handleOuterKeypress}
        ref={ctw => (this.contentWrapper = ctw)}
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
