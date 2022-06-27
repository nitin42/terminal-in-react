import PropTypes from 'prop-types';

export const commandsPropType = PropTypes.objectOf(PropTypes.oneOfType([
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

export const descriptionsPropType = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.bool,
]));

export const TerminalPropTypes = {
  startState: PropTypes.oneOf(['minimised', 'maximised', 'open', 'closed']),
  showActions: PropTypes.bool,
  hideTopBar: PropTypes.bool,
  allowTabs: PropTypes.bool,
  msg: PropTypes.string,
  closedTitle: PropTypes.string,
  closedMessage: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object, // eslint-disable-line
  prompt: PropTypes.string,
  barColor: PropTypes.string,
  outputColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  commands: commandsPropType,
  descriptions: descriptionsPropType,
  watchConsoleLogging: PropTypes.bool,
  commandPassThrough: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  promptSymbol: PropTypes.string,
  plugins: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      class: PropTypes.func,
      config: PropTypes.object,
    }),
  ])),
  shortcuts: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  actionHandlers: PropTypes.shape({
    handleClose: PropTypes.func,
    handleMinimise: PropTypes.func,
    handleMaximise: PropTypes.func,
  }),
  afterChange: PropTypes.func,
  commandWasRun: PropTypes.func,
  disableBuiltin: PropTypes.bool,
};

export const TerminalContextTypes = {
  barShowing: PropTypes.bool,
  tabsShowing: PropTypes.bool,
  activeTab: PropTypes.string,
  instances: PropTypes.array,
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

export const TerminalDefaultProps = {
  startState: 'open',
  hideTopBar: false,
  allowTabs: true,
  showActions: true,
  msg: '',
  closedTitle: 'OOPS! You closed the window.',
  closedMessage: 'Click on the icon to reopen.',
  color: 'green',
  style: {},
  prompt: 'green',
  barColor: 'black',
  backgroundColor: 'black',
  commands: {},
  descriptions: {},
  watchConsoleLogging: false,
  commandPassThrough: false,
  promptSymbol: '>',
  plugins: [],
  shortcuts: {},
  disableBuiltin: false,
};
