import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectInspector from 'react-object-inspector';
import Bar from './Bar';
import Content from './Content';
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
    show: true,
    minimise: false,
    maximise: false,
  };

  getChildContext() {
    return {
      show: this.state.show,
      minimise: this.state.minimise,
      maximise: this.state.maximise,
      symbol: this.state.prompt,
      closeWindow: this.closeWindow,
      minimiseWindow: this.minimiseWindow,
      undoMin: this.undoMin,
      maximiseWindow: this.maximiseWindow,
      undoMax: this.undoMax,
      closeOnMinMax: this.closeOnMinMax,
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

  componentDidUpdate = () => {
    const el = React.findDOMNode(this);
    const app = document.getElementById('app');
    app.scrollTop = el.scrollHeight;
  }

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

  closeWindow = () => this.setState({ show: false });

  openWindow = () => this.setState({ show: true });

  minimiseWindow = () =>
    this.setState({ minimise: true, maximise: false, show: false });

  maximiseWindow = () => this.setState({ maximise: true });

  undoMin = () => this.setState({ minimise: false, show: true });

  undoMax = () => this.setState({ maximise: false });

  closeOnMinMax = () =>
    this.setState({ minimise: false, maximise: false, show: false });

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

  handleChange = (e) => {
    if (e.key === 'Enter') {
      const inputText = e.target.value;
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

      e.target.value = '';
    }
  };

  showContent = (
    props,
    barColor,
    backgroundColor,
    output,
    prompt,
    inputStyles,
    handleChange,
  ) => (
    <div
      className="terminal-container-wrapper"
      style={{ color: props.color, ...props.style }}
    >
      <Bar style={barColor} />
      <Content
        backgroundColor={backgroundColor}
        output={output}
        prompt={prompt}
        inputStyles={inputStyles}
        handleChange={handleChange}
      />
    </div>
  );

  showBar = (props, barColor) => (
    <div
      className="terminal-container-wrapper"
      style={{ color: props.color, ...props.style }}
    >
      <Bar style={barColor} />
    </div>
  );

  showNote = openWindow => (
    <span className="note">
      <h1>OOPS! You closed the window.</h1>
      <img
        src="https://camo.githubusercontent.com/95ad3fffa11193f85dedbf14ca67e4c5c07182d0/687474703a2f2f69636f6e732e69636f6e617263686976652e636f6d2f69636f6e732f70616f6d656469612f736d616c6c2d6e2d666c61742f313032342f7465726d696e616c2d69636f6e2e706e67"
        width="200"
        height="200"
        alt="note"
        onClick={openWindow}
      />
      Click on the icon to reopen.
    </span>
  );

  render() {
    const inputStyles = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.color,
    };

    const prompt = { color: this.props.prompt };
    const barColor = { backgroundColor: this.props.barColor };
    const backgroundColor = { backgroundColor: this.props.backgroundColor };

    const output = this.state.summary.map((content, i) =>
      <div className="terminal-output-line" key={i}>{content}</div> // comma-dangle
    );

    const { show, minimise, maximise } = this.state;

    return (
      <div>
        {show // no-nested-ternary
          ? this.showContent(
            this.props,
            barColor,
            backgroundColor,
            output,
            prompt,
            inputStyles,
            this.handleChange,
          )
          : minimise // no-nested-ternary
            ? this.showBar(this.props, barColor)
            : maximise // no-nested-ternary
              ? this.showContent(
                this.props,
                barColor,
                backgroundColor,
                output,
                prompt,
                inputStyles,
                this.handleChange,
              )
              : this.showNote(this.openWindow)}
      </div>
    );
  }
}

Terminal.childContextTypes = {
  show: PropTypes.bool,
  minimise: PropTypes.bool,
  maximise: PropTypes.bool,
  closeWindow: PropTypes.func,
  minimiseWindow: PropTypes.func,
  undoMin: PropTypes.func,
  maximiseWindow: PropTypes.func,
  undoMax: PropTypes.func,
  closeOnMinMax: PropTypes.func,
  symbol: PropTypes.string,
};

export default Terminal;
