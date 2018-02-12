import React, { Component } from 'react';
import { render } from 'react-dom';

import Terminal from 'terminal-in-react';

class App extends Component {
  intro = () => "My name is Foo!"

  render () {
    return (
      <Terminal
        msg="Hi everyone! This is a terminal component for React"
        commands={{ website: /* some url */, intro: this.intro() }}
        descriptions={{ website: 'My website', intro: 'My introduction' }}
      />
    );
  }
}

render(<App />, document.getElementById('app'));
