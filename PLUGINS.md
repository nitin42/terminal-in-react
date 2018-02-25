# Terminal in React Plugins

## Table of contents

* [Basic Structure](#basic-structure)

* [Plugin Setup](#plugin-setup)

* [Plugin API](#plugin-api)

* [Taking Control](#taking-control)

* [Releasing Control](#releasing-control)

## Basic structure

Each plugin for the terminal should inherit from the plugin base class.

```javascript
import PluginBase from 'terminal-in-react/lib/js/components/Plugin';

class MyPlugin extends PluginBase {
  ...
}
```

This gives you the required plugin structure, but there are attributes that can be
and those that should be overwritten.

The required overrides are (static displayName, static version):

```javascript
class MyPlugin extends PluginBase {
  static displayName = 'MyPlugin';
  static version = '1.0.0';
}
```

### Static attributes

| Attribute        | Type                        | Default | Description |
|:---------------- |:---------------------------:|:-------:|:-----------:|
| **displayName**  | static string               | ''      | Used so other plugins can access data and methods as such should be unique |
| **version**      | static string               | '1.0.0' | Used so other plugins can check that your plugin is a certain version |
| **defaultData**  | static any                  | ''      | Used for data storage that other plugins can get access to |
| **commands**     | static commands             | {}      | Commands that are simple and don't need access to the full plugin api |
| **descriptions** | static command descriptions | {}      | Descriptions for your static commands |
| **shortcuts**    | static shortcuts            | {}      | Simple shortcuts that call only existing commands or any static plugin command |

### Instance attributes and methods

| Attribute            | Type                 | Default    | Description |
|:--------------------:|:--------------------:|:----------:|:-----------:|
| **commands**         | commands             | {}         | Commands that need access to the full plugin api |
| **descriptions**     | command descriptions | {}         | Descriptions for your commands |
| **shortcuts**        | shortcuts            | {}         | Shortcuts that call more complicated methods |
| **getPublicMethods** | <object>function     | () => ({}) | A method to return the public methods your plugin exposes to other plugins |

## Plugin Setup
If you need to use the class constructor you need pass all inputs to `super`.

```javascript
import PluginBase from 'terminal-in-react/lib/js/components/Plugin';

class MyPlugin extends PluginBase {
  static displayName = 'MyPlugin';
  static version = '1.0.0';

  constructor(api, config) {
    super(api, config);
  }
}
```

## Plugin API

The plugin api will be available in all plugin instance methods as `this.api`.

| Key                   | Params                | Description |
|:---------------------:|:---------------------:|:-----------:|
| **printLine**         | content:any           | Used to add a new line to the output, can be of any type.       |
| **removeLine**        | lineNumber:integer:-1 | Used to remove a line from output. If -1 will remove last line. |
| **runCommand**        | cmdText:string, force:bool:false | Used to run a command based on the text. `force` is used when a plugin has taken control. |
| **setCanScroll**      | canScroll:bool      | Used to turn on and off scroll |
| **setScrollPosition** | position:float      | Set scroll top of the terminal |
| **focusInput**        |                     | Used to focus the input |
| **setPromptPrefix**   | promptPrefix:string | Used to set the prompt prefix of the current tab |
| **setPromptSymbol**   | promptSymbol:string | Used to set the prompt symbol ie '>' or '$' |
| **getPluginMethod**   | pluginName:string, methodName:string | Used to get a public method from another plugin |
| **takeControl**       | controller:object, newPromptSymbol:string, newPromptPrefix:string | Used to take full control over the terminal |
| **releaseControl**    |          | Used to release full control |
| **getData**           |          | Used to get the plugin's public data object |
| **setData**           | data:any | Used to set the plugin's public data object |
| **checkVersion**      | comparator:string, version:string | Used to check if the Terminal version meets certain criteria. ['=', '!=', '>', '<', '<=', '>='] ie ('>=', '3.2.0') |
| **version**           | NOT A FUNCTION | The Terminal's version |
| **os**                | NOT A FUNCTION | The os of the current user |

## Taking Control

One of the things a Plugin can do is take "full" control of the Terminal. If done
none of the defualt commands or other plugin's commands will work.

To take "control" use:

```javascript
this.api.takeControl(controller);
```

### The controller object

 - **shortcuts**  : Shortcuts that only work in this mode [Optional]
 - **history**    : If the inputs by are user should be saved to the default input history. Defaults to `false` [Optional]
 - **onKeyPress** : A function to handle the key press event. Params are the key object that was pressed [Optional]
 - **runCommand** : A function to take the input text and run commands with. [Optional]
 - **commands**   : A object of commands that can be run in this mode. Can't be used along with `runCommand`. `runCommand` will take precedence. [Optional]

### Using `runCommand` controller

This allows you to "fully" control all commands that are run even if other
plugins call `this.api.runCommand`. This is mostly true there exists a option on
the api `runCommand` method to bypass the controller. That is the full params for
`this.api.runCommand` are (`inputText`, `force`). If `force` is set to `true` then
the controller will not be called. It is suggested that only a controller call
`this.api.runCommand` with `force` set to `true` for instances where the built in
commands want to be called ie: `this.api.runCommand('clear', true)` to clear
the screen.

## Releasing Control

To do so just call `this.api.releaseControl()`
