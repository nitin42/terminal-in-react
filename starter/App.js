import React from 'react'; // eslint-disable-line
import { render } from 'react-dom';
// import pseudoFileSystemPlugin from 'terminal-in-react-pseudo-file-system-plugin'; // eslint-disable-line
// import NodeEvalPlugin from 'terminal-in-react-node-eval-plugin'; // eslint-disable-line
// Bundle generated with npm run build:production ('../lib/js/index') or use '../src/js'
import Terminal from '../src/js';
import '../src/styles/index.scss'; // (../lib/css/index.css) or  '../src/styles/index.scss'

// const FileSystemPlugin = pseudoFileSystemPlugin();

const App = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Terminal
      startState="maximised"
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
        open: () => window.open('http://terminal-in-react.surge.sh', '_blank'),
      }}
      descriptions={{
        color: 'option for color. For eg - color red',
        'type-text': 'Types out input text',
        open: 'Open a terminal website',
      }}
      shortcuts={{
        'darwin,win,linux': {
          'ctrl + a': 'echo whoo',
        },
      }}
      // plugins={[
      //   FileSystemPlugin,
      //   {
      //     class: NodeEvalPlugin,
      //     config: {
      //       filesystem: FileSystemPlugin.displayName,
      //     },
      //   },
      // ]}
    />
  </div>
);

render(<App />, document.getElementById('app'));
