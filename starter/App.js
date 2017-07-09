import React from 'react';
import { render } from 'react-dom';
// Bundle generated with npm run build:production ('../build/terminal') or use '../components'
import Terminal from '../components';

const App = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
        'type-text': (args, print, runCommand) => {
          const text = args.slice(1).join(' ');
          print('');
          for (let i = 0; i < text.length; i += 1) {
            setTimeout(() => {
              runCommand(`edit-line ${text.slice(0, i + 1)}`);
            }, 100 * i);
          }
        },
      }}
      description={{ color: 'option for color. For eg - color red', 'type-text': 'advance command option'}}    
      commandPassThrough={cmd => `-PassedThrough:${cmd}: command not found`}
    />
  </div>
);

render(<App />, document.getElementById('app'));
