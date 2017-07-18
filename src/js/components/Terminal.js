/* eslint-disable no-console, react/sort-comp */
import React, { Component } from 'react'; // eslint-disable-line
import stringSimilarity from 'string-similarity';
import whatkey from 'whatkey';
import isEqual from 'lodash.isequal';
import Command from '../args';
import { handleLogging, getOs } from '../utils';
import {
  TerminalPropTypes,
  TerminalContextTypes,
  TerminalDefaultProps
} from './types';
import Bar from './Bar';
import Content from './Content';

const os = getOs();

function getShortcuts(shortcuts, obj) {
  Object.keys(obj).forEach(key => {
    const split = key.toLowerCase().replace(/\s/g, '').split(',');
    split.forEach(osName => {
      if (osName === os) {
        shortcuts = {
          ...shortcuts,
          ...obj[key]
        };
      }
    });
  });
  return shortcuts;
}

class Terminal extends Component {
  static displayName = 'Terminal';

  static propTypes = TerminalPropTypes;

  static defaultProps = TerminalDefaultProps;

  static childContextTypes = TerminalContextTypes;

  constructor(props) {
    super(props);

    this.pluginMethods = {};

    this.defaultCommands = {
      // eslint-disable-line react/sort-comp
      show: this.showMsg,
      clear: this.clearScreen,
      help: this.showHelp,
      echo: input => input.slice(1).join(' '),
      'edit-line': {
        method: this.editLine,
        options: [
          {
            name: 'line',
            description: 'the line you want to edit. -1 is the last line',
            init: value => parseInt(value, 10),
            defaultValue: -1
          }
        ]
      }
    };

    this.defaultDesciptions = {
      show: 'show the msg',
      clear: 'clear the screen',
      help: 'list all the commands',
      echo: 'output the input',
      'edit-line': 'edit the contents of an output line'
    };

    this.defaultShortcuts = {
      'win, linux': {
        'ctrl + l': 'clear'
      },
      darwin: {
        'cmd + k': 'clear'
      }
    };
  }

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
    input: [],
    shortcuts: {},
    keyInputs: []
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
      toggleMinimize: this.toggleState('minimise')
    };
  }

  // Prepare the symbol
  componentWillMount = () => {
    this.setState({ prompt: this.props.promptSymbol });
  };

  // Load everything!
  componentDidMount = () => {
    this.loadPlugins();
    this.assembleCommands();
    this.setDescriptions();
    this.setShortcuts();
    this.showMsg();

    if (this.props.watchConsoleLogging) {
      this.watchConsoleLogging();
    }
  };

  // Show the content on toggling
  getAppContent = () => {
    const { show, minimise } = this.state;
    if (!show) {
      return this.getNote();
    }
    if (minimise) {
      return this.getBar();
    }
    return this.getContent();
  };

  // Shows the full window (normal window)
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
      <div className="terminal-container-wrapper" style={{ color, ...style }}>
        <Bar style={barColorStyles} />
        <Content
          output={output}
          prompt={promptStyles}
          inputStyles={inputStyles}
          handleChange={this.handleChange}
          backgroundColor={backgroundColorStyles}
          handlerKeyPress={this.handlerKeyPress}
        />
      </div>
    );
  };

  // Show only bar (minimise)
  getBar = () => {
    const { color, barColor, style } = this.props;
    const barColorStyles = { backgroundColor: barColor };

    return (
      <div className="terminal-container-wrapper" style={{ color, ...style }}>
        <Bar style={barColorStyles} />
      </div>
    );
  };

  // Show msg (on window close)
  getNote = () =>
    <span className="terminal-note">
      <h1>OOPS! You closed the window.</h1>
      <img
        src="https://camo.githubusercontent.com/95ad3fffa11193f85dedbf14ca67e4c5c07182d0/687474703a2f2f69636f6e732e69636f6e617263686976652e636f6d2f69636f6e732f70616f6d656469612f736d616c6c2d6e2d666c61742f313032342f7465726d696e616c2d69636f6e2e706e67"
        width="200"
        height="200"
        alt="note"
        onClick={this.toggleState('show')}
      />
      Click on the icon to reopen.
    </span>;

  // Set descriptions of the commands
  setDescriptions = () => {
    let descriptions = {
      ...this.defaultDesciptions,
      ...this.props.descriptions
    };
    this.props.plugins.forEach(plugin => {
      if (plugin.descriptions) {
        descriptions = {
          ...descriptions,
          ...plugin.descriptions
        };
      }
    });
    this.setState({ descriptions });
  };

  // Set command shortcuts
  setShortcuts = () => {
    let shortcuts = getShortcuts({}, this.defaultShortcuts);
    shortcuts = getShortcuts(shortcuts, this.props.shortcuts);
    this.setState({ shortcuts });
  };

  setPromptPrefix = promptPrefix => {
    this.setState({ promptPrefix });
  };

  // Hide window
  setFalse = name => () => this.setState({ [name]: false });

  // Show window
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

  toggleState = name => () => this.setState({ [name]: !this.state[name] });

  // Prepare the built-in commands
  assembleCommands = () => {
    let commands = {
      ...this.defaultCommands,
      ...this.props.commands
    };

    this.props.plugins.forEach(plugin => {
      if (plugin.commands) {
        commands = {
          ...commands,
          ...plugin.commands
        };
      }
    });

    Object.keys(commands).forEach(name => {
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
        parse = i =>
          cmd.parse(i, {
            name,
            help: true,
            version: false
          });
        method = definition.method;
      }

      commands[name] = {
        parse,
        method
      };
    });
    this.setState({ commands });
  };

  /**
   * autocomplete with the command the have the best match
   * @param {object} input reference
   */
  autocompleteValue = inputRef => {
    const { descriptions } = this.state;
    const keysToCheck = Object.keys(descriptions).filter(
      key => descriptions[key] !== false
    );
    const { bestMatch } = stringSimilarity.findBestMatch(
      inputRef.value,
      keysToCheck
    );

    if (bestMatch.rating >= 0.5) {
      return bestMatch.target;
    }

    return inputRef.value;
  };

  // Refresh or clear the screen
  clearScreen = () => {
    this.setState({ summary: [] });
  };

  // Method to check for shortcut and invoking commands
  checkShortcuts = key => {
    const shortcuts = Object.keys(this.state.shortcuts);
    if (shortcuts.length > 0) {
      const { keyInputs } = this.state;
      let modKey = key;
      if (key === 'meta') {
        // eslint-disable-next-line no-nested-ternary
        modKey = os === 'darwin' ? 'cmd' : os === 'win' ? 'win' : 'meta';
      }
      keyInputs.push(modKey);
      const len = keyInputs.length;

      const options = shortcuts
        .map((cut, i) => [cut.replace(/\s/g, '').split('+'), i])
        .filter(cut => cut[0].length >= keyInputs.length)
        .filter(cut => isEqual(cut[0].slice(0, len), keyInputs));

      if (options.length > 0) {
        if (options.length === 1 && options[0][0].length === len) {
          const shortcut = shortcuts[options[0][1]];
          this.runCommand(this.state.shortcuts[shortcut]);
          this.setState({ keyInputs: [] });
        }
      } else if (keyInputs.length > 0) {
        this.setState({ keyInputs: [] });
      }
    }
  };

  // edit-line command
  editLine = args => {
    const { summary } = this.state;
    let index = args.line;
    if (index === -1) {
      index = summary.length === 0 ? 0 : summary.length - 1;
    }
    summary[index] = args._.join(' ');
    this.setState({ summary });
  };

  // Listen for user input
  handleChange = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.printLine(
        `${this.state.promptPrefix}${this.state.prompt} ${e.target.value}`,
        false
      );
      const { input } = this.state;

      const res = this.runCommand(
        `${input.join('\n')}${input.length > 0 ? '\n' : ''}${e.target.value}`
      );

      if (typeof res !== 'undefined') {
        this.printLine(res);
      }

      const history = [...this.state.history, e.target.value];
      this.setState({
        input: [],
        history,
        historyCounter: history.length
      });
      e.target.value = ''; // eslint-disable-line no-param-reassign
    } else if (e.key === 'Enter' && e.shiftKey) {
      this.printLine(
        `${this.state.promptPrefix}${this.state.prompt} ${e.target.value}`,
        false
      );
      const { input } = this.state;
      const history = [...this.state.history, e.target.value];
      this.setState({
        input: [...input, e.target.value],
        history,
        historyCounter: history.length
      });
      e.target.value = ''; // eslint-disable-line no-param-reassign
    }
  };

  /**
   * Base of key code set the value of the input
   * with the history
   * @param {event} event of input
   */
  handlerKeyPress = (e, inputRef) => {
    const key = whatkey(e).key;
    const { historyCounter, keyInputs } = this.state;
    if (keyInputs.length === 0) {
      switch (key) {
        case 'up':
          this.setValueWithHistory(historyCounter - 1, inputRef);
          break;
        case 'down':
          this.setValueWithHistory(historyCounter + 1, inputRef);
          break;
        case 'tab':
          inputRef.value = this.autocompleteValue(inputRef);
          e.preventDefault();
          break;
        default:
          break;
      }
    }
    this.checkShortcuts(key);
  };

  // Plugins
  loadPlugins = () => {
    if (this.props.plugins) {
      this.props.plugins.forEach(plugin => {
        try {
          plugin.load({
            printLine: this.printLine,
            runCommand: this.runCommand,
            setPromptPrefix: this.setPromptPrefix,
            getPluginMethod: this.getPluginMethod
          });

          this.pluginMethods[plugin.name] = {
            ...plugin.getPublicMethods(),
            _getName: () => plugin.name,
            _getVersion: () => plugin.version
          };
        } catch (e) {
          console.error(`Error loading plugin ${plugin.name}`); // eslint-disable-line no-console
          console.dir(e);
        }
      });

      this.props.plugins.forEach(plugin => {
        try {
          plugin.afterLoad();
        } catch (e) {
          // Do nothing
        }
      });
    }
  };

  // Plugin api method to get a public plugin method
  getPluginMethod = (name, method) => {
    if (this.pluginMethods[name]) {
      if (this.pluginMethods[name][method]) {
        return this.pluginMethods[name][method];
      }
      throw new Error(
        `No method with name ${name} has been registered for plugin ${name}`
      );
    } else {
      throw new Error(`No plugin with name ${name} has been registered`);
    }
  };

  // Print the summary (input -> output)
  printLine = (inp, std = true) => {
    let print = true;
    if (std) {
      const { plugins } = this.props;
      for (let i = 0; i < plugins.length; i += 1) {
        try {
          print = plugins[i].readStdOut(inp);
        } catch (e) {
          // Do nothing
        }
      }
    }

    if (print !== false) {
      const summary = this.state.summary;
      summary.push(inp);
      this.setState({ summary });
    }
  };

  // Execute the commands
  runCommand = inputText => {
    const inputArray = inputText.split(' ');
    const input = inputArray[0];
    const args = inputArray; // Undefined for function call
    const command = this.state.commands[input];
    let res;

    if (input === '') {
      // do nothing
    } else if (command === undefined) {
      if (typeof this.props.commandPassThrough === 'function') {
        res = this.props.commandPassThrough(
          inputArray,
          this.printLine,
          this.runCommand
        );
      } else {
        this.printLine(`-bash:${input}: command not found`);
      }
    } else {
      const parsedArgs = command.parse(args);
      if (
        typeof parsedArgs !== 'object' ||
        (typeof parsedArgs === 'object' && !parsedArgs.help)
      ) {
        res = command.method(parsedArgs, this.printLine, this.runCommand);
      }
    }
    return res;
  };

  // Listen for console logging and pass the input to handler (handleLogging)
  watchConsoleLogging = () => {
    handleLogging('log', this.printLine);
    handleLogging('info', this.printLine);
    // handleLogging('warn', this.printLine);
    // handleLogging('error', this.printLine);
  };

  // List all the commands (state + user defined)
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

  // Show the msg (prop msg)
  showMsg = () => {
    this.printLine(this.props.msg);
  };

  render() {
    return (
      <div
        className="terminal-base"
        style={this.state.maximise ? { maxWidth: '100%', height: '100%' } : {}}
      >
        {this.getAppContent()}
      </div>
    );
  }
}

export default Terminal;