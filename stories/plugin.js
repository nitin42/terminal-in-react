import PluginBase from "terminal-in-react/lib/js/components/Plugin";

export default class MyPlugin extends PluginBase {
  static displayName = "MyPlugin";
  static version = "1.0.0";
  i = 0;
  constructor(api, config) {
    super(api, config);
    setInterval(() => {
      this.api.printLine(this.i++);
    }, 300);
  }
}
