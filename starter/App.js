import React from 'react';
import { render } from 'react-dom';
import Terminal from '../components';

const App = () => (
  <Terminal
    msg="Hello World. My name is Nitin Tulswani"
    commandPassThrough={(cmd, adder) => {
      adder(`PassedThrough: ${cmd}`);
    }}
    watchConsoleLogging
  />
);

render(<App />, document.getElementById('app'));
