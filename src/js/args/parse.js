import parser from 'minimist';

export default function (argv, options) {
  // Override default option values
  Object.assign(this.config, options);

  if (this.config.help) {
    // Register default options and commands
    this.option('help', 'Output usage information');
    this.command('help', 'Display help', this.showHelp);
  }

  // Parse arguments using minimist
  this.raw = parser(argv.slice(1), this.config.minimist);

  // If default version is allowed, check for it
  if (this.config.version) {
    this.checkVersion(this.parent);
  }

  const subCommand = this.raw._[1];
  const helpTriggered = this.raw.h || this.raw.help;

  const args = {};
  const defined = this.isDefined(subCommand, 'commands');
  const optionList = this.getOptions(defined);

  Object.assign(args, this.raw);
  args._.shift();

  // Export sub arguments of command
  this.sub = args._;

  // If sub command is defined, run it
  if (defined) {
    this.runCommand(defined, optionList);
    return {};
  }

  // Show usage information if "help" or "h" option was used
  // And respect the option related to it
  if (this.config.help && helpTriggered) {
    this.showHelp();
  }

  // Hand back list of options
  return optionList;
}
