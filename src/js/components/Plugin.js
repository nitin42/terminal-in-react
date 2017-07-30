export default class Plugin {
  static displayName = '';
  static version = '1.0.0';
  static defaultData = '';

  static commands = {};
  static descriptions = {};

  constructor(api, config = {}) {
    this.api = api;
    this.config = config;
    this.commands = {};
    this.descriptions = {};

    this.updateApi = newApi => (this.api = newApi);
    this.getPublicMethods = () => ({});
    this.readStdOut = () => true;
  }
}
