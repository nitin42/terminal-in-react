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
  TerminalDefaultProps,
} from './types';
import Bar from './Bar';
import Content from './Content';
import Tabs from './Tabs';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
    return v.toString(16);
  });
}

const os = getOs();

function getShortcuts(shortcuts, obj) {
  Object.keys(obj).forEach((key) => {
    const split = key.toLowerCase().replace(/\s/g, '').split(',');
    split.forEach((osName) => {
      if (osName === os) {
        shortcuts = {
          ...shortcuts,
          ...obj[key],
        };
      }
    });
  });
  return shortcuts;
}

function modCommands(commands) {
  const newCommands = {};

  Object.keys(commands).forEach((name) => {
    let needsInstance = false;
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
          version: false,
        });
      method = definition.method;
      needsInstance = definition.needsInstance || false;
    }

    newCommands[name] = {
      parse,
      method,
      needsInstance,
    };
  });

  return newCommands;
}

class Terminal extends Component {
  static displayName = 'Terminal';

  static propTypes = TerminalPropTypes;

  static defaultProps = TerminalDefaultProps;

  static childContextTypes = TerminalContextTypes;

  constructor(props) {
    super(props);

    this.pluginData = {};

    this.defaultCommands = {
      // eslint-disable-line react/sort-comp
      show: this.showMsg,
      clear: {
        method: this.clearScreen,
        needsInstance: true,
      },
      help: {
        method: this.showHelp,
        needsInstance: true,
      },
      echo: input => input.slice(1).join(' '),
      'edit-line': {
        method: this.editLine,
        needsInstance: true,
        options: [
          {
            name: 'line',
            description: 'the line you want to edit. -1 is the last line',
            init: value => parseInt(value, 10),
            defaultValue: -1,
          },
        ],
      },
    };

    this.defaultDesciptions = {
      show: 'show the msg',
      clear: 'clear the screen',
      help: 'list all the commands',
      echo: 'output the input',
      'edit-line': 'edit the contents of an output line',
    };

    this.defaultShortcuts = {
      'win, linux, darwin': {
        'alt + t': this.createTab,
      },
      'win, linux': {
        'ctrl + l': 'clear',
      },
      darwin: {
        'cmd + k': 'clear',
      },
    };

    this.state = {
      prompt: '>',
      commands: {},
      descriptions: {},
      show: props.startState !== 'closed',
      minimise: props.startState === 'minimised',
      maximise: props.startState === 'maximised',
      shortcuts: {},
      activeTab: '',
      tabs: [],
      instances: [],
    };
  }

  getChildContext() {
    return {
      instances: this.state.instances,
      symbol: this.state.prompt,
      show: this.state.show,
      minimise: this.state.minimise,
      maximise: this.state.maximise,
      activeTab: this.state.activeTab,
      barShowing: !this.props.hideTopBar,
      tabsShowing: this.props.allowTabs,
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

  // Prepare the symbol
  componentWillMount = () => {
    this.loadPlugins();
    this.assembleCommands();
    this.setDescriptions();
    this.setShortcuts();

    this.createTab();
    this.setState({ prompt: this.props.promptSymbol });
  };

  // Load everything!
  componentDidMount = () => {
    if (this.props.watchConsoleLogging) {
      this.watchConsoleLogging();
    }
  };

  // Tab creation
  createTab = () => {
    const { color, backgroundColor, prompt, allowTabs } = this.props;
    if (allowTabs) {
      const { tabs } = this.state;
      const id = uuidv4();

      const inputStyles = { backgroundColor, color };
      const promptStyles = { color: prompt };
      const backgroundColorStyles = { backgroundColor };

      tabs.push((
        <Content
          key={id}
          id={id}
          prompt={promptStyles}
          inputStyles={inputStyles}
          handleChange={this.handleChange}
          handlerKeyPress={this.handlerKeyPress}
          backgroundColor={backgroundColorStyles}
          register={(...args) => this.registerInstance(id, ...args)}
        />
      ));

      this.setState({ activeTab: id, tabs });
    }
  }

  // Tab removal
  removeTab = (index) => {
    const { tabs } = this.state;
    tabs.splice(index, 1);
    this.setState({ tabs });
  }

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
    const {
      color,
      style,
      barColor,
      showActions,
      hideTopBar,
      allowTabs,
      actionHandlers,
    } = this.props;
    const { activeTab, tabs } = this.state;

    const barColorStyles = { backgroundColor: barColor };

    return (
      <div className="terminal-container-wrapper" style={{ color, ...style }}>
        {!hideTopBar && (
          <Bar showActions={showActions} style={barColorStyles} {...actionHandlers} />
        )}
        {allowTabs && (
          <Tabs
            active={activeTab}
            setActiveTab={this.setActiveTab}
            createTab={this.createTab}
            removeTab={this.removeTab}
          />
        )}
        {tabs}
      </div>
    );
  };

  // Show only bar (minimise)
  getBar = () => {
    const { color, barColor, style, showActions, actionHandlers } = this.props;
    const barColorStyles = { backgroundColor: barColor };

    return (
      <div className="terminal-container-wrapper" style={{ color, ...style }}>
        <Bar
          showActions={showActions}
          style={barColorStyles}
          {...actionHandlers}
        />
      </div>
    );
  };

  // Show msg (on window close)
  getNote = () => (
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
    </span>
  );

  // Plugin data getter
  getPluginData = name => this.pluginData[name];

  // Plugin data setter
  setPluginData = (name, data) => (this.pluginData[name] = data);

  // Set descriptions of the commands
  setDescriptions = () => {
    let descriptions = {
      ...this.defaultDesciptions,
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

  // Set command shortcuts
  setShortcuts = () => {
    let shortcuts = getShortcuts({}, this.defaultShortcuts);
    shortcuts = getShortcuts(shortcuts, this.props.shortcuts);
    this.setState({ shortcuts });
  };

  // Setter to change the prefix of the input prompt
  setPromptPrefix = (instance, promptPrefix) => {
    instance.setState({ promptPrefix });
  };

  // Set the currently active tab
  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  // Hide window
  setFalse = name => () => this.setState({ [name]: false });

  // Show window
  setTrue = name => () => this.setState({ [name]: true });

  /**
  * set the input value with the possible history value
  * @param {number} next position on the history
  */
  setValueWithHistory = (instance, position, inputRef) => {
    const { history } = instance.state;
    if (history[position]) {
      instance.setState({ historyCounter: position });
      inputRef.value = history[position];
    }
  };

  // Used to keep track of all instances
  registerInstance = (index, instance) => {
    const { instances } = this.state;
    const pluginInstances = {};
    const pluginMethods = {};

    const old = instances.find(i => i.index === index);

    this.props.plugins.forEach((PluginClass) => {
      try {
        const api = {
          printLine: this.printLine.bind(this, instance),
          runCommand: this.runCommand.bind(this, instance),
          setPromptPrefix: this.setPromptPrefix.bind(this, instance),
          getPluginMethod: this.getPluginMethod.bind(this, instance),
          getData: () => this.getPluginData(PluginClass.displayName),
          setData: data => this.setPluginData(PluginClass.displayName, data),
        };

        let plugin;
        if (old) {
          old.pluginInstances[PluginClass.displayName].updateApi(api);
        } else {
          plugin = new PluginClass(api);
          pluginMethods[PluginClass.displayName] = {
            ...plugin.getPublicMethods(),
            _getName: () => PluginClass.displayName,
            _getVersion: () => PluginClass.version,
          };
        }

        pluginInstances[PluginClass.displayName] = plugin;
      } catch (e) {
        console.error(`Error instantiating plugin ${PluginClass.displayName}`, e); // eslint-disable-line no-console
      }
    });

    const data = {
      index,
      instance,
      pluginMethods: old ? old.pluginMethods : pluginMethods,
      pluginInstances: old ? old.pluginInstances : pluginInstances,
    };

    if (old) {
      const realIndex = instances.indexOf(old);
      instances[realIndex] = data;
    } else {
      instances.push(data);
    }

    this.setState({ instances });

    return () => {
      const insts = this.state.instances;
      this.setState({
        instances: insts.filter(i => !isEqual(i.instance, instance)),
      });
    };
  }

  // Toggle a state boolean
  toggleState = name => () => this.setState({ [name]: !this.state[name] });

  // Prepare the built-in commands
  assembleCommands = () => {
    let commands = {
      ...this.defaultCommands,
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

    this.setState({ commands: modCommands(commands) });
  };

  /**
   * autocomplete with the command the have the best match
   * @param {object} input reference
   */
  autocompleteValue = (inputRef) => {
    const { descriptions } = this.state;
    const keysToCheck = Object.keys(descriptions).filter(
      key => descriptions[key] !== false,
    );
    const { bestMatch } = stringSimilarity.findBestMatch(
      inputRef.value,
      keysToCheck,
    );

    if (bestMatch.rating >= 0.5) {
      return bestMatch.target;
    }

    return inputRef.value;
  };

  // Refresh or clear the screen
  clearScreen = (args, printLine, runCommand, instance) => {
    instance.setState({ summary: [] });
  };

  // Method to check for shortcut and invoking commands
  checkShortcuts = (instance, key, e) => {
    const shortcuts = Object.keys(this.state.shortcuts);
    if (shortcuts.length > 0) {
      const { keyInputs } = instance.state;
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
          const action = this.state.shortcuts[shortcut];
          if (typeof action === 'string') {
            this.runCommand(instance, this.state.shortcuts[shortcut]);
          } else if (typeof action === 'function') {
            e.preventDefault();
            e.stopPropagation();
            action();
          }
          instance.setState({ keyInputs: [] });
        }
      } else if (keyInputs.length > 0) {
        instance.setState({ keyInputs: [] });
      }
    }
  };

  // edit-line command
  editLine = (args, printLine, runCommand, instance) => {
    const { summary } = instance.state;
    let index = args.line;
    if (index === -1) {
      index = summary.length === 0 ? 0 : summary.length - 1;
    }
    summary[index] = args._.join(' ');
    instance.setState({ summary });
  };

  // Listen for user input
  handleChange = (instance, e) => {
    const { input, promptPrefix, history } = instance.state;
    if (e.key === 'Enter' && !e.shiftKey) {
      if (typeof e.dontShowCommand === 'undefined') {
        this.printLine.bind(this, instance)(
          `${promptPrefix}${this.state.prompt} ${e.target.value}`,
          false,
        );
      }

      input.push(e.target.value);
      const res = this.runCommand(instance, `${input.join('\n')}`);

      if (typeof res !== 'undefined') {
        this.printLine.bind(this, instance)(res);
      }

      const newHistory = [...history, e.target.value];
      instance.setState({
        input: [],
        history: newHistory,
        historyCounter: newHistory.length,
      });
      e.target.value = ''; // eslint-disable-line no-param-reassign
    } else if (e.key === 'Enter' && e.shiftKey) {
      this.printLine.bind(this, instance)(
        `${promptPrefix}${this.state.prompt} ${e.target.value}`,
        false,
      );
      const newHistory = [...history, e.target.value];
      instance.setState({
        input: [...input, e.target.value],
        history: newHistory,
        historyCounter: newHistory.length,
      });
      e.target.value = ''; // eslint-disable-line no-param-reassign
    }
  };

  /**
   * Base of key code set the value of the input
   * with the history
   * @param {event} event of input
   */
  handlerKeyPress = (instance, e, inputRef) => {
    const key = whatkey(e).key;
    const { historyCounter, keyInputs } = instance.state;
    if (keyInputs.length === 0) {
      switch (key) {
        case 'up':
          this.setValueWithHistory(instance, historyCounter - 1, inputRef);
          break;
        case 'down':
          this.setValueWithHistory(instance, historyCounter + 1, inputRef);
          break;
        case 'tab':
          inputRef.value = this.autocompleteValue(inputRef);
          e.preventDefault();
          break;
        default:
          break;
      }
    }
    this.checkShortcuts(instance, key, e);
  }

  // Plugins
  loadPlugins = () => {
    const pluginData = {};
    this.props.plugins.forEach((plugin) => {
      try {
        pluginData[plugin.displayName] = plugin.defaultData;
      } catch (e) {
        console.error(`Error loading plugin ${plugin.displayName}`, e); // eslint-disable-line no-console
      }
    });
    this.pluginData = pluginData;
  };

  // Plugin api method to get a public plugin method
  getPluginMethod = (instance, name, method) => {
    const instanceData = this.state.instances.find(i => isEqual(i.instance, instance));
    if (instanceData) {
      if (instanceData.pluginMethods[name]) {
        if (instanceData.pluginMethods[name][method]) {
          return instanceData.pluginMethods[name][method];
        }
        console.log(instanceData.pluginMethods[name]);
        throw new Error(
          `No method with name ${method} has been registered for plugin ${name}`,
        );
      } else {
        throw new Error(`No plugin with name ${name} has been registered`);
      }
    }
    return null;
  };

  // Print the summary (input -> output)
  printLine = (instance, inp, std = true) => {
    let print = true;
    if (std) {
      const instanceData = this.state.instances.find(i => isEqual(i.instance, instance));
      if (instanceData) {
        const plugins = instanceData.pluginInstances;
        for (let i = 0; i < plugins.length; i += 1) {
          try {
            print = plugins[i].readStdOut(inp);
          } catch (e) {
            // Do nothing
          }
        }
      }
    }

    if (print !== false) {
      const summary = instance.state.summary;
      summary.push(inp);
      instance.setState({ summary });
    }
  };

  // Execute the commands
  runCommand = (instance, inputText) => {
    const inputArray = inputText.split(' ');
    const input = inputArray[0];
    const args = inputArray; // Undefined for function call
    const instanceData = this.state.instances.find(i => isEqual(i.instance, instance));
    let commands = { ...this.state.commands };
    if (instanceData) {
      Object.values(instanceData.pluginInstances).forEach((i) => {
        commands = {
          ...commands,
          ...modCommands(i.commands),
        };
      });
    }
    const command = commands[input];
    let res;

    if (input === '') {
      // do nothing
    } else if (command === undefined) {
      if (typeof this.props.commandPassThrough === 'function') {
        res = this.props.commandPassThrough(
          inputArray,
          this.printLine.bind(this, instance),
          this.runCommand.bind(this, instance),
        );
      } else {
        this.printLine.bind(this, instance)(`-bash:${input}: command not found`);
      }
    } else {
      const parsedArgs = command.parse(args);
      const type = typeof parsedArgs;
      if (type !== 'object' || (type === 'object' && !parsedArgs.help)) {
        res = command.method(
          parsedArgs,
          this.printLine.bind(this, instance),
          this.runCommand.bind(this, instance),
          command.needsInstance === true ? instance : undefined,
        );
      }
    }
    return res;
  };

  // Print to active instance
  printToActive = (...args) => {
    const data = this.state.instances.find(i => i.index === this.state.activeTab);
    if (data && data.instance !== null) {
      this.printLine(data.instance, ...args);
    }
  }

  // Listen for console logging and pass the input to handler (handleLogging)
  watchConsoleLogging = () => {
    handleLogging('log', this.printToActive);
    handleLogging('info', this.printToActive);
    // handleLogging('warn', this.printToActive);
    // handleLogging('error', this.printToActive);
  };

  // List all the commands (state + user defined)
  showHelp = (args, printLine, runCommand, instance) => {
    let commands = { ...this.state.commands };
    let descriptions = { ...this.state.descriptions };
    const instanceData = this.state.instances.find(i => isEqual(i.instance, instance));
    if (instanceData) {
      Object.values(instanceData.pluginInstances).forEach((i) => {
        commands = {
          ...commands,
          ...i.commands,
        };
        descriptions = {
          ...descriptions,
          ...i.descriptions,
        };
      });
    }
    const options = Object.keys(commands);

    for (const option of options) {
      // eslint-disable-line no-restricted-syntax
      if (descriptions[option] !== false) {
        printLine(`${option} - ${descriptions[option]}`);
      }
    }
  };

  // Show the msg (prop msg)
  showMsg = (args, printLine) => {
    if (this.props.msg && this.props.msg.length > 0) {
      printLine(this.props.msg);
    }
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
