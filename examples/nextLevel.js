import React, { Component } from 'react';
import { render } from 'react-dom';
import PseudoFileSystem from 'terminal-in-react-pseudo-file-system-plugin';
import Terminal from 'terminal-in-react';

class App extends Component {
  intro = () => 'My name is Foo!'

  render() {
    return (
      <Terminal
        msg="Hi everyone! This is a terminal component for React"
        plugins={[
          new PseudoFileSystem(),
        ]}
        commands={{
          // Async handling
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
        description={{ 'type-text': 'Types a input text', /* disable default option */show: false, clear: false }}
      />
    );
  }
}

render(<App />, document.getElementById('app'));
