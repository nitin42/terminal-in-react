export default class Plugin {
  constructor(name = '', version = '1.0.0') {
    this.name = name;
    this.version = version;
  }

  load = () => {};

  afterLoad = () => {};

  getPublicMethods = () => ({});

  readStdOut = () => true;
}
