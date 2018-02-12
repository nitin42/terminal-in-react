import Command from '../../args/index';
import { getOs } from '../../utils';

export const os = getOs();

export function pluginMap(plugins, eachHandler) {
  return plugins.map((plugin) => {
    if (typeof plugin === 'function') {
      plugin = {
        class: plugin,
        config: undefined,
      };
    }
    return plugin;
  }).forEach(pluginObj => eachHandler(pluginObj.class, pluginObj.config));
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // eslint-disable-line
    return v.toString(16);
  });
}

export function getShortcuts(shortcuts, obj) {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const split = key.toLowerCase().replace(/\s/g, '').split(',');
      split.forEach((osName) => {
        if (osName === os) {
          shortcuts = {
            ...shortcuts,
            ...obj[key],
          };
        }
      });
    });
  }
  return shortcuts;
}

export function modCommands(commands) {
  const newCommands = {};

  Object.keys(commands).forEach((name) => {
    let needsInstance = false;
    const definition = commands[name];
    let method = definition;
    let parse = i => i;
    if (typeof definition !== 'undefined') {
      if (typeof definition === 'object') {
        const cmd = new Command();
        if (typeof definition.options !== 'undefined') {
          try {
            cmd.options(definition.options);
          } catch (e) {
            throw new Error('options for command wrong format');
          }
        }
        parse = i =>
          cmd.parse(i, {
            name,
            help: true,
            version: false,
          });
        method = definition.method; // eslint-disable-line
        needsInstance = definition.needsInstance || false;
      }

      newCommands[name] = {
        parse,
        method,
        needsInstance,
      };
    }
  });

  return newCommands;
}
