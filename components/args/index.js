import chalk from 'chalk';
import options from 'args/lib/options';
import parse from 'args/lib/parse';
import example from 'args/lib/example';
import examples from 'args/lib/examples';
import option from './option';
import command from './command';
import showHelp from './help';
import utils from './utils';

const publicMethods = {
  command,
  option,
  options,
  parse,
  example,
  examples,
  showHelp,
};

export default function Args() {
  this.details = {
    commands: [],
    options: [],
    examples: [],
  };

  // Configuration defaults
  this.config = {
    help: true,
    usageFilter: null,
    value: null,
    name: null,
    mainColor: 'yellow',
    subColor: 'dim',
  };

  this.printMainColor = chalk;
  this.printSubColor = chalk;

  this.parent = module.parent;
}

// Assign internal helpers
for (const util in utils) {
  if (!{}.hasOwnProperty.call(utils, util)) {
    continue; // eslint-disable-line
  }

  Args.prototype[util] = utils[util];
}

// Assign public methods
for (const method in publicMethods) {
  if (!{}.hasOwnProperty.call(publicMethods, method)) {
    continue; // eslint-disable-line
  }

  Args.prototype[method] = publicMethods[method];
}
