# Terminal in React
![version](https://img.shields.io/badge/terminal--in--react-3.0.1-brightgreen.svg)
![size](https://img.shields.io/badge/size-33.4%20KB-brightgreen.svg)
![size](https://img.shields.io/badge/gzip-9.85%20KB-brightgreen.svg)

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Terminal
          color="green"
          backgroundColor="black"
          barColor="black"
          style={{ fontWeight: 'bold', fontSize: '1em' }}
          commands={{
            'open-google': () => window.open("https://www.google.com/", "_blank"),
            showmsg: this.showMsg,
            popup: () => alert("Terminal in React")
          }}
          descriptions={{
            'open-google': 'opens google.com',
            showmsg: 'shows a message',
            alert: 'alert', popup: 'alert'
          }}
          msg="You can write anything here. Example - Hello! My name is Foo and I like Bar."
        />
      </div>
    );
  }
}
```

> Be careful when copying this example because it uses `window` object (`'open-google': () => window.open("https://www.google.com/", "_blank"),`) which is only available on the client-side and it will give you an error if you're doing server side rendering.

<p align="center">
  <img src="https://i.gyazo.com/a7e35f346b909349a02438ee17678956.gif" />
</p>

## Working

### Adding commands

To add your own command, use prop `commands` which accepts an object. This objects then maps `command name -> command function`.

Let's take an example. You want to open a website with a command `open-google`

```jsx
<Terminal commands={{ 'open-google': () => window.open("https://www.google.com/", "_blank")}} />
```

### Adding description of your command

Add a description of your command using prop `description`.

```jsx
<Terminal descriptions={{ 'open-google': 'opens google' }} />
```

### Console logging

You can have the terminal watch console.log/info function and print out.
It does so by default.

```jsx
<Terminal watchConsoleLogging />
```

<p align="center">
  <img src="http://g.recordit.co/a6D6PCtTcL.gif"/>
</p>

### Command passthrough

You can have the terminal pass out the cmd that was input

```jsx
<Terminal commandPassThrough={cmd => `-PassedThrough:${cmd}: command not found`} />
```

### Async handling of commands
you can also handle the result with a callback
```jsx
<Terminal
  commandPassThrough={(cmd, print) => {
    // do something async
    print(`-PassedThrough:${cmd}: command not found`);
  }}
/>
```

### Minimise, maximise and close the window

<p align="center">
  <img src="https://camo.githubusercontent.com/3748e38abc72cb7860ba8f2272c0329ded5bfe23/687474703a2f2f672e7265636f726469742e636f2f5a5965554b6d62414e512e676966" />
</p>

### Hide the default options

```jsx
<Terminal descriptions={{ color: false, show: false, clear: false }} />
```

This will hide the option color, show and clear.


### Advanced commands

You can give your commands options and get them back parsed to the method.
Using this method will also give your command a build in help output.
With the option `-h` or `--help`.

```jsx
<Terminal
  commands={{
    color: {
      method: (args, print, runCommand) => {
        print(`The color is ${args._[0] || args.color}`);
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
```
<p align="center">
  <img src="https://i.gyazo.com/65468696bece70704bd8bcc50e6504e9.gif"/>
</p>

The command API has three parameters `arguments`, `print`, and `runCommand`.

 - `arguments` will be an array of the input split on spaces or and object with
 parameters meeting the options given as well as a `_` option with any strings given
 after the options.
 - `print` is a method to write a new line to the terminals output. Any string returned
 as a result of a command will also be printed.
 - `runCommand` is a method to call other commands it takes a string and will
 attempt to run the command given

Let's take an another example -

```jsx
<Terminal
  commands={{
    'type-text': (args, print, runCommand) => {
      const text = args.slice(1).join(' ');
      print('');
      for (let i = 0; i < text.length; i += 1) {
        setTimeout(() => {
          runCommand(`edit-line ${text.slice(0, i + 1)}`);
        }, 100 * i);
      }
    }
  }}
/>

```

<p align="center">
  <img src="https://i.gyazo.com/ef2427464989b1ce14bc44bb4fc94689.gif" />
</p>

### Using plugins 🔥

We have also developed a plugin system for the `<Terminal />` component which helps you develop custom plugins. Here is one example of plugin which creates a fake file system called [terminal-in-react-pseudo-file-system-plugin](https://github.com/jcgertig/terminal-in-react-pseudo-file-system-plugin).

#### Instantiating the plugin

```jsx
import PseudoFileSystem from 'terminal-in-react-pseudo-file-system-plugin'

<Terminal
  plugins={[
    new PseudoFileSystem(),
  ]}
/>
```
<p align="center">
  <img src="http://g.recordit.co/4xcIZRKJCD.gif" />
</p>

Awesome! Right? Let us know if you make something interesting 😃

### Tab autocomplete

<p align="center">
  <img src="https://i.gyazo.com/3e719f4091cbd72f3e1f99209493e50d.gif" />
</p>

### Multiline input

via `shift + enter`

<p align="center">
  <img src="http://g.recordit.co/AznpOohzJL.gif" />
</p>

### Check history of your commands

<p align="center">
  <img src="https://i.gyazo.com/6fa55a8fbb961787c51e406e612e0bb8.gif" />
</p>

## Customization

Use

* prop `color` to change the color of the text.
* prop `backgroundColor` to change the background.
* prop `barColor` to change the color of bar.
* prop `prompt` to change the prompt (`>`) color.

Follow me on Twitter [@NTulswani](https://twitter.com/NTulswani) for new updates and progress 😄

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
| **watchConsoleLogging** | bool | false |
| **commandPassThrough** | function | null |
| **promptSymbol** | string | > |
| **plugins** | array | [ { name: '', load: new Plugin(), commands: {} descriptions: {} } ] |

## Built-in commands

* `clear` - Clears the screen
* `help` - List all the commands
* `show` - Shows a msg if any
* `echo` - Outputs anything given
* `edit-line` - Edits the last line or a given line using the `-l` argument

## Where to use ?

* Embed it as a toy on your website
* For showcasing
* Explain any of your project using this terminal component
* or just play with it

## You want a X feature

Sure! Create an issue for that and I will look into it.

## Contributing

[Contributing Guide](./CONTRIBUTING.md)

## Troubleshooting

**Getting build errors when using `create-react-app`**<br/>

* Eject from `create-react-app` and use a custom webpack configuration with [`babili-webpack-plugin`](https://github.com/webpack-contrib/babili-webpack-plugin). Read more about this [here](https://github.com/facebookincubator/create-react-app/issues/984).
