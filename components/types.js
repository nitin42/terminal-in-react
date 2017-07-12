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
  shortcuts: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
};

// shortcuts example
// {
//   'win,linux': {
//     'ctrl + l': 'clear'
//   },
//   'darwin': {
//     'cmd + k': 'clear'
//   }
// }

export const TerminalContextTypes = {
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
