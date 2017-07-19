export default class Plugin {
  static name = '';
  static version = '1.0.0';
  static defaultData = '';

  static commands = {};
  static descriptions = {};

  constructor(api) {
    this.api = api;
    this.commands = {};
    this.descriptions = {};
  }

  getPublicMethods = () => ({});

  readStdOut = () => true;
}
