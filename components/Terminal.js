/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ObjectInspector from 'react-object-inspector';
import Command from './args';
import Bar from './Bar';
import Content from './Content';
import './Terminal.css';

(function setOldLogger() {
  console['oldLog'] = console['log']; // eslint-disable-line dot-notation
}());

function handleLogging(method, addToOutput) {
  // eslint-disable-next-line no-console
  console[method] = (...args) => {
    try {
      console.oldLog(`[${method}]`, ...args);
    } catch (e) {
      throw new Error('Terminal was loaded more than once check script tags');
    }
    const res = [...args].slice(0, 15).map((arg, i) => {
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

const commandsPropType = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      defaultValue: PropTypes.any,
    })),
    method: PropTypes.func,
  }),
]));

const descriptionsPropType = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.bool,
]));

class Terminal extends Component {
  static displayName = 'Terminal';

  static propTypes = {
    msg: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object, // eslint-disable-line
    prompt: PropTypes.string,
    barColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    commands: commandsPropType,
    descriptions: descriptionsPropType,
    watchConsoleLogging: PropTypes.bool,
    commandPassThrough: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.bool,
    ]),
    promptSymbol: PropTypes.string,
    plugins: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      load: PropTypes.func,
      commands: commandsPropType,
      descriptions: descriptionsPropType,
    })),
  };

  static defaultProps = {
    msg: '',
    color: 'green',
    style: {},
    prompt: 'green',
    barColor: 'black',
    backgroundColor: 'black',
    commands: {},
    descriptions: {},
    watchConsoleLogging: true,
    commandPassThrough: false,
    promptSymbol: '>',
    plugins: [],
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
    promptPrefix: '',
    summary: [],
    commands: {},
    descriptions: {},
    history: [],
    historyCounter: 0,
    show: true,
    minimise: false,
    maximise: false,
  };

  getChildContext() {
    return {
      symbol: this.state.promptPrefix + this.state.prompt,
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

  /* Life cycle */
  componentWillMount = () => {
    this.setState({ prompt: this.props.promptSymbol });
  };

  componentDidMount = () => {
    this.loadPlugins();
    this.assembleCommands();
    this.setDescriptions();
    this.showMsg();

    if (this.props.watchConsoleLogging) {
      this.watchConsoleLogging();
    }
  };

  /* Getters */
  getAppContent = () => {
    const { show, minimise } = this.state;
    if (!show) {
      return this.showNote();
    }
    if (minimise) {
      return this.showBar();
    }
    return this.showContent();
  };

  getContent = () => {
    const { backgroundColor, color, style, barColor, prompt } = this.props;

    const inputStyles = { backgroundColor, color };
    const promptStyles = { color: prompt };
    const barColorStyles = { backgroundColor: barColor };
    const backgroundColorStyles = { backgroundColor };

    const output = this.state.summary.map((content, i) => {
      if (typeof content === 'string' && content.length === 0) {
        return <div className="terminal-output-line" key={i}>&nbsp;</div>;
      }
      return <pre className="terminal-output-line" key={i}>{content}</pre>;
    });

    return (
      <div
        className="terminal-container-wrapper"
        style={{ color, ...style }}
      >
        <Bar style={barColorStyles} />
        <Content
          output={output}
          prompt={promptStyles}
          inputStyles={inputStyles}
          handleChange={this.handleChange}
          backgroundColor={backgroundColorStyles}
          setHistoryCommand={this.setHistoryCommand}
        />
      </div>
    );
  };

  getBar = () => {
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

  getNote = () => (
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

  /* Setters */
  setDescriptions = () => {
    let descriptions = {
      show: 'show the msg',
      clear: 'clear the screen',
      help: 'list all the commands',
      echo: 'output the input',
      'edit-line': 'edit the contents of an output line',
      ...this.props.descriptions,
    };
    this.props.plugins.forEach((plugin) => {
      if (plugin.descriptions) {
        descriptions = {
          ...descriptions,
          ...plugin.descriptions,
        };
      }
    });
    this.setState({ descriptions });
  };

  setFalse = name => () => this.setState({ [name]: false });

  /**
   * Base of key code set the value of the input
   * with the history
   * 38 is key up
   * 40 is key down
   * @param {event} event of input
   */
  setHistoryCommand = (e, inputRef) => {
    const { historyCounter } = this.state;
    if (e.keyCode === 38) {
      this.setValueWithHistory(historyCounter - 1, inputRef);
    } else if (e.keyCode === 40) {
      this.setValueWithHistory(historyCounter + 1, inputRef);
    }
  };

  setPromptPrefix = (promptPrefix) => {
    this.setState({ promptPrefix });
  };

  setTrue = name => () => this.setState({ [name]: true });

  /**
   * set the input value with the possible history value
   * @param {number} next position on the history
   */
  setValueWithHistory = (position, inputRef) => {
    const { history } = this.state;
    if (history[position]) {
      this.setState({ historyCounter: position });
      inputRef.value = history[position];
    }
  };

  /* General */
  assembleCommands = () => {
    let commands = {
      show: this.showMsg,
      clear: this.clearScreen,
      help: this.showHelp,
      echo: (input) => { console.log(...input.slice(1)); },
      'edit-line': {
        method: this.editLine,
        options: [
          {
            name: 'line',
            description: 'the line you want to edit. -1 is the last line',
            init: value => parseInt(value, 10),
            defaultValue: -1,
          },
        ],
      },
      ...this.props.commands,
    };

    this.props.plugins.forEach((plugin) => {
      if (plugin.commands) {
        commands = {
          ...commands,
          ...plugin.commands,
        };
      }
    });

    Object.keys(commands).forEach((name) => {
      const definition = commands[name];
      let method = definition;
      let parse = i => i;
      if (typeof definition === 'object') {
        const cmd = new Command();
        if (typeof definition.options !== 'undefined') {
          try {
            cmd.options(definition.options);
          } catch (e) {
            throw new Error('options for command wrong format');
          }
        }
        parse = i => cmd.parse(i, {
          name,
          help: true,
          version: false,
        });
        method = definition.method;
      }

      commands[name] = {
        parse,
        method,
      };
    });
    this.setState({ commands });
  };

  clearScreen = () => {
    this.setState({ summary: [] });
  };

  editLine = (args) => {
    const { summary } = this.state;
    let index = args.line;
    if (index === -1) {
      index = summary.length === 0 ? 0 : summary.length - 1;
    }
    summary[index] = args._.join(' ');
    this.setState({ summary });
  }

  handleChange = (e) => {
    if (e.key === 'Enter') {
      this.printLine(`${this.state.promptPrefix}${this.state.prompt} ${e.target.value}`);

      const res = this.runCommand(e.target.value);

      if (typeof res !== 'undefined') {
        this.printLine(res);
      }

      const history = [...this.state.history, e.target.value];
      this.setState({
        history,
        historyCounter: history.length,
      });
      e.target.value = ''; // eslint-disable-line no-param-reassign
    }
  };

  loadPlugins = () => {
    this.props.plugins.forEach((plugin) => {
      try {
        plugin.load({
          printLine: this.printLine,
          runCommand: this.runCommand,
          setPromptPrefix: this.setPromptPrefix,
        });
      } catch (e) {
        console.error(`Error loading plugin ${plugin.name}`); // eslint-disable-line no-console
        console.dir(e);
      }
    });
  };

  printLine = (inp) => {
    const summary = this.state.summary;
    summary.push(inp);
    this.setState({ summary });
  };

  runCommand = (inputText) => {
    const inputArray = inputText.split(' ');
    const input = inputArray[0];
    const args = inputArray; // Undefined for function call
    const command = this.state.commands[input];
    let res;

    if (input === '') {
      // do nothing
    } else if (command === undefined) {
      if (typeof this.props.commandPassThrough === 'function') {
        res = this.props.commandPassThrough(inputArray, this.printLine, this.runCommand);
      } else {
        this.printLine(`-bash:${input}: command not found`);
      }
    } else {
      const parsedArgs = command.parse(args);
      if (typeof parsedArgs !== 'object' || (typeof parsedArgs === 'object' && !parsedArgs.help)) {
        res = command.method(parsedArgs, this.printLine, this.runCommand);
      }
    }
    return res;
  }

  toggleState = name => () => this.setState({ [name]: !this.state[name] });

  watchConsoleLogging = () => {
    handleLogging('log', this.printLine);
    handleLogging('info', this.printLine);
    handleLogging('warn', this.printLine);
    handleLogging('error', this.printLine);
  };

  showHelp = () => {
    const options = Object.keys(this.state.commands);
    const descriptions = this.state.descriptions;
    for (const option of options) {
      // eslint-disable-line no-restricted-syntax
      if (descriptions[option] !== false) {
        this.printLine(`${option} - ${descriptions[option]}`);
      }
    }
  };

  showMsg = () => {
    this.printLine(this.props.msg);
  };

  /* Render */
  render() {
    return (
      <div className="terminal-base" style={this.state.maximise ? { maxWidth: '100%', height: '100%' } : {}}>
        {this.getContent()}
      </div>
    );
  }
}

export default Terminal;
