import React from 'react'; // eslint-disable-line
import { render } from 'react-dom';
import PseudoFileSystem from 'terminal-in-react-pseudo-file-system-plugin'; // eslint-disable-line
// Bundle generated with npm run build:production ('../lib/js/index') or use '../src/js'
import Terminal from '../src/js';
import '../src/styles/index.scss'; // (../lib/css/index.css) or  '../src/styles/index.scss'

const App = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Terminal
      startState="maximised"
      allowTabs
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
        open: () => window.open('https://www.nitintulswani.surge.sh', '_blank'),
      }}
      descriptions={{
        color: 'option for color. For eg - color red',
        'type-text': 'Types out input text',
        open: 'Open a website',
      }}
      shortcuts={{
        'darwin,win,linux': {
          'ctrl + a': 'echo whoo',
        },
      }}
    />
  </div>
);

render(<App />, document.getElementById('app'));
