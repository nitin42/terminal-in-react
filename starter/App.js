import React from 'react';
import { render } from 'react-dom';
import Terminal from '../build/terminal.js';

const App = () => (
  <Terminal msg="Hello World. My name is Nitin Tulswani" />
);

render(<App />, document.getElementById('app'));
