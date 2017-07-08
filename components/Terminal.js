import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectInspector from 'react-object-inspector';
import Bar from './Bar';
import './Terminal.css';

(function setOldLogger() {
  console['oldLog'] = console['log']; // eslint-disable-line no-console, dot-notation
}());

function handleLogging(method, addToOutput) {
  console[method] = (...args) => { // eslint-disable-line no-console
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
  static displayName='Terminal';

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

  state = {
    prompt: '>',
    summary: [],
    commands: {},
    description: {},
  };

  componentDidMount = () => {
    this.com.focus();
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
        clear: 'clear the screen',
        show: 'show the msg',
        help: 'list all the commands',
        ...this.props.description,
      },
    });
  }

  allCommands = () => {
    this.setState({
      commands: {
        clear: this.clearScreen,
        show: this.showMsg,
        help: this.showHelp,
        ...this.props.commands,
      },
    });
  }

  watchConsoleLogging = () => {
    handleLogging('log', this.adder);
    handleLogging('info', this.adder);
    handleLogging('warn', this.adder);
    handleLogging('error', this.adder);
  }

  adder = (inp) => {
    const summary = this.state.summary;
    summary.push(inp);
    this.setState({ summary });
  }

  clearScreen = () => {
    this.setState({
      summary: [],
    });
  }

  showMsg = () => {
    this.adder(this.props.msg);
  }

  showHelp = () => {
    const options = Object.keys(this.state.commands);
    const description = this.state.description;
    for (const option of options) { // eslint-disable-line no-restricted-syntax
      this.adder(`${option} - ${description[option]}`);
    }
  }

  handleChange = (e) => {
    if (e.key === 'Enter') {
      const inputText = this.com.value;
      const inputArray = inputText.split(' ');
      const input = inputArray[0];
      const arg = inputArray[1]; // Undefined for function call
      const command = this.state.commands[input];

      if (command === undefined) {
        if (typeof this.props.commandPassThrough === 'function') {
          this.props.commandPassThrough(input, this.adder);
        } else {
          this.adder(`-bash:${input}: command not found`);
        }
      } else if (input === 'clear') {
        this.clearScreen();
      } else {
        this.adder(command(arg));
      }

      this.com.value = '';
    }
  }

  focusInput = () => {
    this.com.focus();
  }

  render() {
    const inputStyles = { backgroundColor: this.props.backgroundColor, color: this.props.color };
    const prompt = { color: this.props.prompt };
    const barColor = { backgroundColor: this.props.barColor };
    const backgroundColor = { backgroundColor: this.props.backgroundColor };

    const output = this.state.summary.map((content, i) => (
      <div className="terminal-output-line" key={i}>{content}</div>
    ));

    return (
      <div className="terminal-container-wrapper" style={{ color: this.props.color, ...this.props.style }}>
        <Bar style={barColor} />
        <div
          className="terminal-container terminal-container-main"
          style={backgroundColor}
          onClick={this.focusInput}
        >
          <div className="terminal-holder">
            <div className="terminal-content">
              <div className="terminal-input-area">
                {output}
                <p>
                  <span className="terminal-prompt" style={prompt}>
                    {this.state.prompt}
                  </span>
                  <input
                    className="terminal-main-input"
                    style={inputStyles}
                    type="text"
                    ref={com => (this.com = com)}
                    onKeyPress={this.handleChange}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Terminal;
