export default class Plugin {
  static displayName = '';
  static version = '1.0.0';
  static defaultData = '';

  static commands = {};
  static descriptions = {};

  constructor(api) {
    this.api = api;
    this.commands = {};
    this.descriptions = {};

    this.updateApi = newApi => (this.api = newApi);
    this.getPublicMethods = () => ({});
    this.readStdOut = () => true;
  }
}
