# Terminal in React
[![Downloads][npm-dm]][package-url]
[![Downloads][npm-dt]][package-url]
[![NPM Version][npm-v]][package-url]
[![Dependencies][deps]][package-url]
[![Dev Dependencies][dev-deps]][package-url]
[![License][license]][package-url]
![size](https://img.shields.io/badge/size-31.4%20KB-brightgreen.svg)
![size](https://img.shields.io/badge/gzip-8.63%20KB-brightgreen.svg)

<p align="center">
  <img src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/terminal-icon.png"  width="300" height="300" />
</p>

> A component that renders a terminal

## Table of contents

* [Install](#install)

* [Usage](#usage)

* [Working](#working)

* [Plugins](#using-plugins-)

* [Features](#more-features)

* [Customization](#customization)

* [API reference](#api)

* [Built-in commands](#built-in-commands)

* [Where to use ?](#where-to-use-)

* [Add a feature](#you-want-a-x-feature)

* [Contributing](#contributing)

* [Troubleshooting](#troubleshooting)

* [Detailed reference](https://github.com/nitin42/terminal-in-react/wiki)

## Install

```
npm install terminal-in-react --save
```
or if you use `yarn`

```
yarn add terminal-in-react
```

This package also depends on `react` so make sure you've already installed it.

## Usage


```jsx
import React, { Component } from 'react';
import Terminal from 'terminal-in-react';

class App extends Component {
  showMsg = () => 'Hello World'

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <Terminal
          color='green'
          backgroundColor='black'
          barColor='black'
          style={{ fontWeight: "bold", fontSize: "1em" }}
          commands={{
            'open-google': () => window.open('https://www.google.com/', '_blank'),
            showmsg: this.showMsg,
            popup: () => alert('Terminal in React')
          }}
          descriptions={{
            'open-google': 'opens google.com',
            showmsg: 'shows a message',
            alert: 'alert', popup: 'alert'
          }}
          msg='You can write anything here. Example - Hello! My name is Foo and I like Bar.'
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

### Adding commands ✍️

To add your own command, use prop `commands` which accepts an object. This objects then maps `command name -> command function`.

Let's take an example. You want to open a website with a command `open-google`

```jsx
<Terminal commands={{ 'open-google': () => window.open("https://www.google.com/", "_blank")}} />
```

### Adding description of your command 💁🏼‍♂️

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

### Async handling of commands 😎
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

```jsx
<Terminal
  closedTitle='OOPS! You closed the window.'
  closedMessage='Click on the icon to reopen.'
/>
```

<p align="center">
  <img src="https://camo.githubusercontent.com/3748e38abc72cb7860ba8f2272c0329ded5bfe23/687474703a2f2f672e7265636f726469742e636f2f5a5965554b6d62414e512e676966" />
</p>

### Hide the default options

```jsx
<Terminal descriptions={{ color: false, show: false, clear: false }} />
```

This will hide the option color, show and clear.


### Advanced commands 👨‍💻

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

## Using plugins 🔥

[Plugin Documentation](PLUGINS.md).

We have also developed a plugin system for the `<Terminal />` component which helps you develop custom plugins. Here is one example of plugin which creates a fake file system called [terminal-in-react-pseudo-file-system-plugin](https://github.com/jcgertig/terminal-in-react-pseudo-file-system-plugin).

### Instantiating the plugin

```jsx
import pseudoFileSystem from 'terminal-in-react-pseudo-file-system-plugin';
const FileSystemPlugin = pseudoFileSystem();

<Terminal
  plugins={[
    FileSystemPlugin,
  ]}
/>
```

or if the plugin requires config

```jsx
import NodeEvalPlugin from 'terminal-in-react-node-eval-plugin';
import pseudoFileSystemPlugin from 'terminal-in-react-pseudo-file-system-plugin';
const FileSystemPlugin = pseudoFileSystemPlugin();

...
<Terminal
  plugins={[
    FileSystemPlugin,
    {
      class: NodeEvalPlugin,
      config: {
        filesystem: FileSystemPlugin.displayName
      }
    }
  ]}
/>
...
```

<p align="center">
  <img src="http://g.recordit.co/4xcIZRKJCD.gif" />
</p>

Awesome! Right? Let us know if you make something interesting 😃

## Plugin List

 - [terminal-in-react-pseudo-file-system-plugin](https://github.com/jcgertig/terminal-in-react-pseudo-file-system-plugin) : A client-side only filesystem
 - [terminal-in-react-node-eval-plugin](https://github.com/jcgertig/terminal-in-react-node-eval-plugin) : used with a filesystem to evaluate js code
 - [terminal-in-react-vi-plugin](https://github.com/jcgertig/terminal-in-react-vi-plugin) : used with a filesystem to edit the contents of files more easily


## More features

### Tab autocomplete

<p align="center">
  <img src="https://i.gyazo.com/3e719f4091cbd72f3e1f99209493e50d.gif" />
</p>

### Multiline input 🤹🏼‍♀️

via `shift + enter`

<p align="center">
  <img src="http://g.recordit.co/AznpOohzJL.gif" />
</p>

### Check history of your commands 🖱️

using arrow down and up keys

<p align="center">
  <img src="https://i.gyazo.com/6fa55a8fbb961787c51e406e612e0bb8.gif" />
</p>

### Keyboard shortcuts ⌨
You can define keyboard shortcuts. They have to be grouped by os. The three available are
`win`, `darwin`, and `linux`. You can group multiple os by a `,` for example if the
shortcut was for all platforms `win,darwin,linux` would be fine as a key

```jsx
<Terminal
  shortcuts={{
    'darwin,win,linux': {
      'ctrl + a': 'echo whoo',
    },
  }}
/>
```

But you might want to specific

```jsx
<Terminal
  shortcuts={{
    'win': {
      'ctrl + a': 'echo hi windows',
    },
    'darwin': {
      'cmd + a': 'echo hi mac'
    },
    'linux': {
      'ctrl + a': 'echo hi linux'
    }
  }}
/>
```

You can mix and match

```jsx
<Terminal
  shortcuts={{
    'win,linux': {
      'ctrl + b': 'echo we are special',
    },
    'win': {
      'ctrl + a': 'echo hi windows',
    },
    'darwin': {
      'cmd + a': 'echo hi mac'
    },
    'linux': {
      'ctrl + a': 'echo hi linux'
    }
  }}
/>
```

The value of the shortcut should be a command to run.


## Override the top bar buttons actionHandlers

Use the prop `actionHandlers`.

The object allows for 3 methods `handleClose`, `handleMaximise`, `handleMinimise`;

Each one is a function and will pass in the default method as the first param.
Any method not passed in will use the default.

```jsx
<Terminal
  actionHandlers={{
    handleClose: (toggleClose) => {
      // do something on close
      toggleClose();
    },
    handleMaximise: (toggleMaximise) => {
      // do something on maximise
      toggleMaximise();
    }
  }}
/>
```

## Customization

Use

* prop `color` to change the color of the text.
* prop `outputColor` to change the color of the output text defaults to color prop.
* prop `backgroundColor` to change the background.
* prop `barColor` to change the color of bar.
* prop `prompt` to change the prompt (`>`) color.
* prop `showActions` to change if the three circles are shown.
* prop `hideTopBar` to hide the top bar altogether.
* prop `allowTabs` to allow multiple tabs.

## API

**component props**

| Props        | Type           | Default  |
| ------------- |:-------------:| -----:|
| **color**      | string | 'green' |
| **outputColor** | string | props.color |
| **backgroundColor**      | string      |   'black' |
| **prompt** | string      |    'green' |
| **barColor** | string      |    'black' |
| **description** | object      |    {} |
| **commands** | object      |    { clear, help, show, } |
| **msg** | string      |    - |
| **closedTitle** | string      |    OOPS! You closed the window. |
| **closedMessage** | string      |    Click on the icon to reopen. |
| **watchConsoleLogging** | bool | false |
| **commandPassThrough** | function | null |
| **promptSymbol** | string | > |
| **plugins** | array | [ { name: '', load: new Plugin(), commands: {} descriptions: {} } ] |
| **startState** | string ['open', 'maximised', 'minimised', 'closed'] | 'open' |
| **showActions** | bool | true |
| **hideTopBar** | bool | false |
| **allowTabs** | bool | true |
| **actionHandlers** | object | - |

## Built-in commands

* `clear` - Clears the screen
* `help` - List all the commands
* `show` - Shows a msg if any
* `echo` - Display the input message
* `edit-line` - Edits the last line or a given line using the `-l` argument

## Where to use ?

* Embed it as a toy on your website
* For showcasing
* Explain any of your projects using this terminal component
* or just play with it

## You want a X feature

Sure! Check our [todolist](./todo.md) or create an issue.

## Contributing

[Contributing Guide](./CONTRIBUTING.md)

## Troubleshooting

**Build errors when using with `create-react-app`**<br/>

Eject from `create-react-app` and use a custom webpack configuration with [`babili-webpack-plugin`](https://github.com/webpack-contrib/babili-webpack-plugin). Read more about this [here](https://github.com/facebookincubator/create-react-app/issues/984).

**Style issues when maximizing**

Set the style to `height: 100vh` on parent element.

[npm-dm]: https://img.shields.io/npm/dm/terminal-in-react.svg
[npm-dt]: https://img.shields.io/npm/dt/terminal-in-react.svg
[npm-v]: https://img.shields.io/npm/v/terminal-in-react.svg
[deps]: https://img.shields.io/david/nitin42/terminal-in-react.svg
[dev-deps]: https://img.shields.io/david/dev/nitin42/terminal-in-react.svg
[license]: https://img.shields.io/npm/l/terminal-in-react.svg
[package-url]: https://npmjs.com/package/terminal-in-react

<a href="https://app.codesponsor.io/link/FCRW65HPiwhNtebDx2tTc53E/nitin42/terminal-in-react" rel="nofollow"><img src="https://app.codesponsor.io/embed/FCRW65HPiwhNtebDx2tTc53E/nitin42/terminal-in-react.svg" style="width: 888px; height: 68px;" alt="Sponsor" /></a>
