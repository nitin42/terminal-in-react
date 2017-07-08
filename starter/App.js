import React from 'react';
import { render } from 'react-dom';
// Bundle generated with npm run build:production ('../build/terminal') or use '../components'
import Terminal from '../components';

const App = () => (
  <Terminal
    msg="Hello World. My name is Nitin Tulswani"
    commands={{
      color: {
        method: (args) => {
          console.log(`The color is ${args._[0] || args.color}`); // eslint-disable-line
        },
        options: [
          {
            name: 'color',
            description: 'The color the output should be',
            defaultValue: 'white',
          },
        ],
      },
    }}
  />
);

render(<App />, document.getElementById('app'));
