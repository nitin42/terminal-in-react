import React from 'react';
import { render } from 'react-dom';
<<<<<<< HEAD
import Terminal from '../components';

const App = () => (
  <Terminal
    msg="Hello World. My name is Nitin Tulswani"
    commandPassThrough={(cmd, adder) => {
      adder(`PassedThrough: ${cmd}`);
    }}
    watchConsoleLogging
  />
=======
// Bundle generated with npm run build:production 
import Terminal from '../build/terminal.js';

const App = () => (
  <Terminal msg="Hello World. My name is Nitin Tulswani" watchConsoleLogging={true} />
>>>>>>> nitin42/master
);

render(<App />, document.getElementById('app'));
