export default function (name, description, defaultValue, init) {
  // prevent adding twice
  if (this.details.options.find(flagName => flagName.name == name)) {
    return this;
  }
  let usage = [];

  const assignShort = (n, options, short) => {
    if (options.find(flagName => flagName.usage[0] === short)) {
      short = n.charAt(0).toUpperCase(); // eslint-disable-line no-param-reassign
    }
    return [short, n];
  };

  // If name is an array, pick the values
  // Otherwise just use the whole thing
  switch (name.constructor) {
    case String:
      usage = assignShort(name, this.details.options, name.charAt(0));
      break;
    case Array:
      usage = usage.concat(name);
      break;
    default:
      throw new Error('Invalid name for option');
  }

  // Throw error if short option is too long
  if (usage.length > 0 && usage[0].length > 1) {
    throw new Error('Short version of option is longer than 1 char');
  }

  const optionDetails = {
    name,
    defaultValue,
    usage,
    description,
  };

  if (this.details.options.filter(item => item.usage[1] === usage[1]).length === 0) {
    let defaultIsWrong;

    switch (defaultValue) {
      case false:
        defaultIsWrong = true;
        break;
      case null:
        defaultIsWrong = true;
        break;
      case undefined:
        defaultIsWrong = true;
        break;
      default:
        defaultIsWrong = false;
    }

    // Set initializer depending on type of default value
    if (!defaultIsWrong) {
      const initFunction = typeof init === 'function';
      optionDetails.init = initFunction ? init : this.handleType(defaultValue)[1];
    }

    // Register option to global scope
    this.details.options.push(optionDetails);
  }

  // Allow chaining of .option()
  return this;
}
