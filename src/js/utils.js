/* eslint-disable no-console */
import React from 'react'; // eslint-disable-line
import ObjectInspector from 'react-object-inspector'
import platform from 'platform';

// Capture the console.log calls (hijacking)
(function setOldLogger() {
  console['oldLog'] = console['log']; // eslint-disable-line dot-notation
}());

// Handle console logging
// eslint-disable-next-line import/prefer-default-export
export function handleLogging(method, addToOutput) {
  // eslint-disable-next-line no-console
  console[method] = (...args) => {
    try {
      console.oldLog(`[${method}]`, ...args);
    } catch (e) {
      throw new Error('Terminal was loaded more than once check script tags');
    }
    const res = [...args].slice(0, 15).map((arg, i) => {
      switch (typeof arg) {
        case 'object':
          return <ObjectInspector data={arg} key={`object-${i}`} />;
        case 'function':
          return `${arg}`;
        default:
          return arg;
      }
    });
    addToOutput(res);
  };
  Object.defineProperty(console[method], 'name', { value: method, writable: false }); // eslint-disable-line no-console
}

export function isServer() {
  return !(typeof window !== 'undefined' && window.document);
}

const linuxPlatforms = ['Ubuntu', 'Debian', 'Fedora', 'Red Hat', 'SuSE', 'Android'];
const darwinPlatforms = ['OS X', 'iOS'];

export function getOs() {
  const { os } = platform;
  if (os.family.indexOf('Windows') === 0) {
    return 'win';
  }
  if (linuxPlatforms.indexOf(os.family) > -1) {
    return 'linux';
  }
  if (darwinPlatforms.indexOf(os.family) > -1) {
    return 'darwin';
  }
  return 'unknown';
}
