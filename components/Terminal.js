import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Bar from './Bar';
import './Terminal.css';

class Terminal extends Component {
  static displayName='Terminal';

  static propTypes = {  
    msg: PropTypes.string,
    color: PropTypes.string,
    prompt: PropTypes.string,
    barColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    commands: PropTypes.objectOf(PropTypes.func),
    description: PropTypes.objectOf(PropTypes.string)
  };

  state = {
    prompt: '>',
    summary: [],
    commands: {},
    description: {},
  };

  componentDidMount = () => {
    const node = this.refs.com;
    node.focus();  
    this.allCommands();
    this.setDescription();
    this.showMsg();
  };

  adder = (inp) => {
    let summary = this.state.summary;
    summary.push(inp);
    this.setState({ summary, });
  }

  allCommands = () => {
    this.setState({
      commands: {
        'clear': this.clearScreen,
        'show': this.showMsg,
        'help': this.showHelp,
        ...this.props.commands
      }
    });
  }

  setDescription = () => {
    this.setState({
      description: {
        'clear': 'clear the screen',
        'show': 'show the msg',
        'help': 'list all the commands',
        ...this.props.description
      }
    })
  }

  clearScreen = () => {
    this.setState({
      summary: []
    });
  }

  showMsg = () => {
    this.adder(this.props.msg);
  }

  showHelp = () => {
    const options = Object.keys(this.state.commands);
    const description = this.state.description
    for (var option of options) {
      this.adder(`${option} - ${description[option]}`);
    }
  }

  handleChange = (e) => {
    if (e.key === "Enter") {  
      var inputText = this.refs.com.value;
      var inputArray = inputText.split(' ');
      var input = inputArray[0];
      var arg = inputArray[1]; // Undefined for function call
      var command = this.state.commands[input];
      this.adder(this.state.prompt + " " + inputText);

      if (command === undefined) {
        this.adder("-bash:" + input + ": command not found");
      }  

      else if (input === 'clear') {
        this.clearScreen();
      } 

      else {
        this.adder(command(arg));
      }

      this.refs.com.value = "";
    }
  }

  render () {
    const inputStyles = { backgroundColor: this.props.backgroundColor, color: this.props.color };
    const prompt = { color: this.props.prompt };
    const barColor = { backgroundColor: this.props.barColor };
    const backgroundColor = { backgroundColor: this.props.backgroundColor }

    const output = this.state.summary.map((content, i) => {
      return (
        <p key={i}>{content}</p>
      );
    });

    return (
      <div className="container-main" style={{ color: this.props.color, ...this.props.style }}>
        <Bar style={ barColor }/>
        <div className="container" id="main" style={backgroundColor}>
          <div className="holder">
            <div id="content">
              <div className="input-area">
                {output}
                <p>
                  <span className="prompt" style={prompt}>{this.state.prompt}</span>
                  <input className="main" style={inputStyles} type="text" ref="com" onKeyPress={this.handleChange} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Terminal;
