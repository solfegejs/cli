solfegejs-cli
=============

Command Line Interface of SolfegeJS


Installation
------------

The bundle is included by default in SolfegeJS. You don't need to install it.

See [SolfegeJS](https://github.com/neolao/solfege/)


Available commands
------------------

In order to expore commands, you need to create a `console.js` file:

```javascript
const solfege = require("solfegejs");

// Initialize the application
let application = solfege.factory();

// Start the application
// The first 2 parameters are removed (node and the script)
application.start(process.argv.slice(2));
```


Expose a command
----------------

To expose a command, you have to create a service with a specific tag:

```yaml
services:
    my_command:
        class: "Command/MyCommand"
        tags:
            - { name: "solfege.console.command" }
```

And your class must implement 2 methods (`getName` and `execute`):

```javascript
export default class MyCommand
{
    getName()
    {
        return "my-command";
    }

    *execute(parameters, options)
    {
        console.log("My command executed");
    }
}
```

Now you can call your command like that:

```bash
node console.js my-command
```

Tests
-----

You need to install peer dependencies first:

```bash
npm install --no-save @solfege/application
```

Then run the following command:

```bash
npm test
```
