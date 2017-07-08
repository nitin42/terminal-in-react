import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectInspector from 'react-object-inspector';
import Bar from './Bar';
import Content from './Content';
import './Terminal.css';

(function setOldLogger() {
  console['oldLog'] = console['log']; // eslint-disable-line no-console, dot-notation
}());

function handleLogging(method, addToOutput) {
  // eslint-disable-next-line no-console
  console[method] = (...args) => {
    try {
      console.oldLog(`[${method}]`, ...args); // eslint-disable-line no-console
    } catch (e) {
      throw new Error('Terminal was loaded more than once check script tags');
    }
    const res = [...args].map((arg, i) => {
      switch (typeof arg) {
        case 'object':
          return <ObjectInspector data={arg} key={`object-${i}`} />;
        case 'function':
          return `${arg}`;
        default:
          return arg;
      }
    });
    addToOutput(res);
  };
  Object.defineProperty(console[method], 'name', { value: method, writable: false }); // eslint-disable-line no-console
}

class Terminal extends Component {
  static displayName = 'Terminal';

  static propTypes = {
    msg: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object, // eslint-disable-line
    prompt: PropTypes.string,
    barColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    commands: PropTypes.objectOf(PropTypes.func),
    description: PropTypes.objectOf(PropTypes.string),
    watchConsoleLogging: PropTypes.bool,
    commandPassThrough: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool,
    ]),
  };

  static defaultProps = {
    msg: '',
    color: 'green',
    style: {},
    prompt: 'green',
    barColor: 'black',
    backgroundColor: 'black',
    commands: {},
    description: {},
    watchConsoleLogging: false,
    commandPassThrough: false,
  };

  static childContextTypes = {
    symbol: PropTypes.string,
    show: PropTypes.bool,
    minimise: PropTypes.bool,
    maximise: PropTypes.bool,
    closeWindow: PropTypes.func,
    openWindow: PropTypes.func,
    minimiseWindow: PropTypes.func,
    unminimiseWindow: PropTypes.func,
    maximiseWindow: PropTypes.func,
    unmaximiseWindow: PropTypes.func,
    toggleShow: PropTypes.func,
    toggleMaximise: PropTypes.func,
    toggleMinimize: PropTypes.func,
  };

  state = {
    prompt: '>',
    summary: [],
    commands: {},
    description: {},
    show: true,
    minimise: false,
    maximise: false,
  };

  getChildContext() {
    return {
      symbol: this.state.prompt,
      show: this.state.show,
      minimise: this.state.minimise,
      maximise: this.state.maximise,
      openWindow: this.setTrue('show'),
      closeWindow: this.setFalse('show'),
      minimiseWindow: this.setTrue('minimise'),
      unminimiseWindow: this.setFalse('minimise'),
      maximiseWindow: this.setTrue('maximise'),
      unmaximiseWindow: this.setFalse('maximise'),
      toggleShow: this.toggleState('show'),
      toggleMaximise: this.toggleState('maximise'),
      toggleMinimize: this.toggleState('minimise'),
    };
  }

  componentDidMount = () => {
    this.allCommands();
    this.setDescription();
    this.showMsg();

    if (this.props.watchConsoleLogging) {
      this.watchConsoleLogging();
    }
  };

  setDescription = () => {
    this.setState({
      description: {
        show: 'show the msg',
        ...this.props.description,
        clear: 'clear the screen',
        help: 'list all the commands',
      },
    });
  };

  setTrue = name => () => this.setState({ [name]: true });

  setFalse = name => () => this.setState({ [name]: false });

  getContent = () => {
    const { show, minimise } = this.state;
    if (!show) {
      return this.showNote();
    }
    if (minimise) {
      return this.showBar();
    }
    return this.showContent();
  }

  toggleState = name => () => this.setState({ [name]: !this.state[name] });

  allCommands = () => {
    this.setState({
      commands: {
        show: this.showMsg,
        ...this.props.commands,
        clear: this.clearScreen,
        help: this.showHelp,
      },
    });
  };

  watchConsoleLogging = () => {
    handleLogging('log', this.adder);
    handleLogging('info', this.adder);
    handleLogging('warn', this.adder);
    handleLogging('error', this.adder);
  };

  adder = (inp) => {
    const summary = this.state.summary;
    summary.push(inp);
    this.setState({ summary });
  };

  clearScreen = () => {
    this.setState({
      summary: [],
    });
  };

  showMsg = () => {
    this.adder(this.props.msg);
  };

  showHelp = () => {
    const options = Object.keys(this.state.commands);
    const description = this.state.description;
    for (const option of options) {
      // eslint-disable-line no-restricted-syntax
      this.adder(`${option} - ${description[option]}`);
    }
  };

  handleChange = (e) => {
    if (e.key === 'Enter') {
      const inputText = e.target.value;
      const inputArray = inputText.split(' ');
      const input = inputArray[0];
      const arg = inputArray[1]; // Undefined for function call
      const command = this.state.commands[input];

      if (command === undefined) {
        if (typeof this.props.commandPassThrough === 'function') {
          const res = this.props.commandPassThrough(input, this.adder);
          if (typeof res !== 'undefined') {
            this.adder(res);
          }
        } else {
          this.adder(`-bash:${input}: command not found`);
        }
      } else {
        this.adder(command(arg));
      }

      e.target.value = ''; // eslint-disable-line no-param-reassign
    }
  };

  showContent = () => {
    const { backgroundColor, color, style, barColor, prompt } = this.props;

    const inputStyles = { backgroundColor, color };
    const promptStyles = { color: prompt };
    const barColorStyles = { backgroundColor: barColor };
    const backgroundColorStyles = { backgroundColor };

    const output = this.state.summary.map((content, i) =>
      <div className="terminal-output-line" key={i}>{content}</div>, // comma-dangle
    );

    return (
      <div
        className="terminal-container-wrapper"
        style={{ color, ...style }}
      >
        <Bar style={barColorStyles} />
        <Content
          backgroundColor={backgroundColorStyles}
          output={output}
          prompt={promptStyles}
          inputStyles={inputStyles}
          handleChange={this.handleChange}
        />
      </div>
    );
  };

  showBar = () => {
    const { color, barColor, style } = this.props;
    const barColorStyles = { backgroundColor: barColor };

    return (
      <div
        className="terminal-container-wrapper"
        style={{ color, ...style }}
      >
        <Bar style={barColorStyles} />
      </div>
    );
  }

  showNote = () => (
    <span className="note">
      <h1>OOPS! You closed the window.</h1>
      <img
        src="https://camo.githubusercontent.com/95ad3fffa11193f85dedbf14ca67e4c5c07182d0/687474703a2f2f69636f6e732e69636f6e617263686976652e636f6d2f69636f6e732f70616f6d656469612f736d616c6c2d6e2d666c61742f313032342f7465726d696e616c2d69636f6e2e706e67"
        width="200"
        height="200"
        alt="note"
        onClick={this.toggleState('show')}
      />
      Click on the icon to reopen.
    </span>
  );

  render() {
    return (
      <div>
        {this.getContent()}
      </div>
    );
  }
}

export default Terminal;
