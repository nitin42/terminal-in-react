import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectInspector from 'react-object-inspector';
import Bar from './Bar';
import './Terminal.css';

console.oldLog = console['log']; // eslint-disable-line no-console, dot-notation

function handleLogging(method, addToOutput) {
  console[method] = (...args) => {
    // eslint-disable-line no-console
    console.oldLog(`[${method}]`, ...args); // eslint-disable-line no-console
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
  };

  state = {
    prompt: '>',
    summary: [],
    commands: {},
    description: {},
    history: [],
    historyCounter: 0,
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
  };

  allCommands = () => {
    this.setState({
      commands: {
        clear: this.clearScreen,
        show: this.showMsg,
        help: this.showHelp,
        ...this.props.commands,
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

  /**
   * set the input value with the possible history value
   * @param {number} next position on the history
   */
  setValueWithHistory = (position) => {
    const { history } = this.state;
    if (history[position]) {
      this.setState({ historyCounter: position });
      this.com.value = history[position];
    }
  };

  /**
   * Base of key code set the value of the input
   * with the history
   * 38 is key up
   * 40 is key down
   * @param {event} event of input
   */
  setHistoryCommand = (e) => {
    const { historyCounter } = this.state;
    if (e.keyCode === 38) {
      this.setValueWithHistory(historyCounter - 1);
    } else if (e.keyCode === 40) {
      this.setValueWithHistory(historyCounter + 1);
    }
  };

  handleChange = (e) => {
    if (e.key === 'Enter') {
      const inputText = this.com.value;
      const inputArray = inputText.split(' ');
      const input = inputArray[0];
      const arg = inputArray[1]; // Undefined for function call
      const command = this.state.commands[input];
      this.adder(`${this.state.prompt} ${inputText}`);

      if (command === undefined) {
        this.adder(`-bash:${input}: command not found`);
      } else if (input === 'clear') {
        this.clearScreen();
      } else {
        this.adder(command(arg));
      }

      this.com.value = '';
      const history = [...this.state.history, input];
      this.setState({
        history,
        historyCounter: history.length,
      });
    }
  };

  render() {
    const inputStyles = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.color,
    };
    const prompt = { color: this.props.prompt };
    const barColor = { backgroundColor: this.props.barColor };
    const backgroundColor = { backgroundColor: this.props.backgroundColor };

    const output = this.state.summary.map((content, i) => (
      <div className="terminal-output-line" key={i}>{content}</div>
    ));

    return (
      <div
        className="terminal-container-wrapper"
        style={{ color: this.props.color, ...this.props.style }}
      >
        <Bar style={barColor} />
        <div
          className="terminal-container terminal-container-main"
          style={backgroundColor}
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
                    ref={com => this.com = com}
                    onKeyPress={this.handleChange}
                    onKeyDown={this.setHistoryCommand}
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
