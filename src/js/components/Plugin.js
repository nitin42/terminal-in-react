export default class Plugin {
  static defaultData = '';
  static name = '';
  static version = '1.0.0';

  constructor(api) {
    this.api = api;
  }

  getPublicMethods = () => ({});

  readStdOut = () => true;
}
