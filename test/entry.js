import React from 'react';
import ReactDOM from 'react-dom';

import Terminal from '../components/Terminal';

const elemDiv = document.createElement('div');
document.body.appendChild(elemDiv);
ReactDOM.render((
  <Terminal
    color="green"
    barColor="black"
    backgroundColor="black"
    style={{ fontWeight: 'bold', fontSize: '1em' }}
    watchConsoleLogging
  />
), elemDiv);
