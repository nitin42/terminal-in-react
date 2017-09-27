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
};

export const TerminalContextTypes = {
  barShowing: PropTypes.bool,
  tabsShowing: PropTypes.bool,
  activeTab: PropTypes.string,
  instances: PropTypes.array,
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

export const TerminalDefaultProps = {
  startState: 'open',
  hideTopBar: false,
  allowTabs: true,
  showActions: true,
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
  shortcuts: {},
};
