import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bar from './Bar';
import './Terminal.css';
import ObjectInspector from 'react-object-inspector';

const oldConsoleLog = console['log'];

function handleLogging(method, addToOutput) {
  console[method] = (...args) => {
    oldConsoleLog(`[${method}]`, ...args);
    const res = [...args].map((arg, i) => {
      switch (typeof arg) {
        case 'object':
          return <ObjectInspector data={arg} key={i} />;
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
  static displayName='Terminal';

  static propTypes = {
    msg: PropTypes.string,
    color: PropTypes.string,
    prompt: PropTypes.string,
    barColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    commands: PropTypes.objectOf(PropTypes.func),
    description: PropTypes.objectOf(PropTypes.string),
    watchConsoleLogging: PropTypes.bool,
  };

  state = {
    prompt: '>',
    summary: [],
    commands: {},
    description: {},
    watchConsoleLogging: false
  };

  componentDidMount = () => {
    const node = this.refs.com;
    node.focus();
    this.allCommands();
    this.setDescription();
    this.showMsg();

    if (this.props.watchConsoleLogging) {
      this.watchConsoleLogging();
    }
  };

  adder = (inp) => {
    let summary = this.state.summary;
    summary.push(inp);
    this.setState({ summary, });
  }

  watchConsoleLogging = () => {
    handleLogging('log', this.adder);
    handleLogging('info', this.adder);
    handleLogging('warn', this.adder);
    handleLogging('error', this.adder);
  }

  allCommands = () => {
    this.setState({
      commands: {
        'clear': this.clearScreen,
        'show': this.showMsg,
        'help': this.showHelp,
        ...this.props.commands
      }
    });
  }

  setDescription = () => {
    this.setState({
      description: {
        'clear': 'clear the screen',
        'show': 'show the msg',
        'help': 'list all the commands',
        ...this.props.description
      }
    })
  }

  clearScreen = () => {
    this.setState({
      summary: []
    });
  }

  showMsg = () => {
    this.adder(this.props.msg);
  }

  showHelp = () => {
    const options = Object.keys(this.state.commands);
    const description = this.state.description
    for (var option of options) {
      this.adder(`${option} - ${description[option]}`);
    }
  }

  handleChange = (e) => {
    if (e.key === 'Enter') {
      var inputText = this.refs.com.value;
      var inputArray = inputText.split(' ');
      var input = inputArray[0];
      var arg = inputArray[1]; // Undefined for function call
      var command = this.state.commands[input];
      this.adder(this.state.prompt + ' ' + inputText);

      if (command === undefined) {
        this.adder('-bash:' + input + ': command not found');
      }

      else if (input === 'clear') {
        this.clearScreen();
      }

      else {
        this.adder(command(arg));
      }

      this.refs.com.value = '';
    }
  }

  render () {
    const inputStyles = { backgroundColor: this.props.backgroundColor, color: this.props.color };
    const prompt = { color: this.props.prompt };
    const barColor = { backgroundColor: this.props.barColor };
    const backgroundColor = { backgroundColor: this.props.backgroundColor }

    const output = this.state.summary.map((content, i) => {
      return (
        <div className="terminal-output-line" key={i}>{content}</div>
      );
    });

    return (
      <div className="terminal-container-wrapper" style={{ color: this.props.color, ...this.props.style }}>
        <Bar style={barColor} />
        <div className="terminal-container terminal-container-main" style={backgroundColor}>
          <div className="terminal-holder">
            <div className="terminal-content">
              <div className="terminal-input-area">
                {output}
                <p>
                  <span className="terminal-prompt" style={prompt}>{this.state.prompt}</span>
                  <input className="terminal-main-input" style={inputStyles} type="text" ref="com" onKeyPress={this.handleChange} />
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
