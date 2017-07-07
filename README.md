# Terminal in React

<p align="center">
  <img src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/terminal-icon.png"  width="300" height="300" />
</p>

> A tiny component that renders a terminal 

## Install

```
npm install terminal-in-react --save
```
or if you use `yarn`

```
yarn add terminal-in-react
```

## Usage


```jsx
import React, { Component } from 'react';
import Terminal from 'terminal-in-react';

class App extends Component {
  showMsg = () => 'Hello World'

  render() {
    return (
      <div>
        <Terminal
          color="green"
          backgroundColor="black"
          barColor="black"
          style={{ fontWeight: 'bold', fontSize: '1em' }}
          commands={{ 'open-google': () => window.open("https://www.google.com/", "_blank"), showmsg: this.showMsg, popup: () => alert("Terminal in React") }}
          description={{ 'open-google': 'opens google.com', showmsg: 'shows a message', alert: 'alert', popup: 'alert' }}
          msg="You can write anything here. Example - Hello! My name is Foo and I like Bar."
        />
      </div>
    );
  }
}
```

Output -

  ![term-gif](https://i.gyazo.com/a7e35f346b909349a02438ee17678956.gif)

## Working

To add your own command, use prop `commands` which accepts an object. This objects then maps `command name -> command function`.

Let's take an example. You want to open a website with a command `open-google`

```jsx
<Terminal commands={{ 'open-google': () => window.open("https://www.google.com/", "_blank")}} />
```

Add a description of your command using prop `description`.

```jsx
<Terminal description={{ 'open-google': 'opens google' }} />
```

## Customisation

Use 

* prop `color` to change the color of the text.
* prop `backgroundColor` to change the background.
* prop `barColor` to change the color of bar.
* prop `prompt` to change the prompt (`$`) color.

## API

| Props        | Type           | Default  |
| ------------- |:-------------:| -----:|
| **color**      | string | 'green' |
| **backgroundColor**      | string      |   'black' |
| **prompt** | string      |    'green' |
| **barColor** | string      |    'black' |
| **description** | object      |    {} |
| **commands** | object      |    { clear: this.clearScreen(), help: this.showHelp(), show: this.showMsg() } |
| **msg** | string      |    - |


## Built-in commands

* `clear` - Clears the screen
* `help` - List all the commands
* `show` - Shows a msg if any

## What's more ?

* will support images, gifs.
* animations.
* and more stuff to make it look more interactive

## Where to use ?

* Embed it as a toy on your website
* For showcasing
* Explain any of your project using this terminal component
* or just play with it

## You want a X fetaure 

Sure! Create an issue for that and I will look into it.

  
