import React, { Component } from 'react';
import { render } from 'react-dom';
// Bundle generated with npm run build:production 
import Terminal from '../build/terminal.js';

class App extends Component {
	render () {
		return (
			<Terminal msg="Hello World. My name is Nitin Tulswani" />
		);
	}
}

render(<App />, document.getElementById('app'));