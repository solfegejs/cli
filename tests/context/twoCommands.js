const Application = require("@solfege/application");
const CommandsRegistry = require("../../lib/CommandsRegistry");
const Bundle = require("../../lib/Bundle");
const Command1 = require("./commands/Command1");
const Command2 = require("./commands/Command2");

const application = new Application();
const registry = new CommandsRegistry();
registry.addCommand(new Command1());
registry.addCommand(new Command2());

application.setParameter("serviceContainer", {
  get: name => {
    if (name === "solfege_console_commands_registry") {
      return registry;
    }
  }
});

const bundle = new Bundle();
application.addBundle(bundle);

const parameters = process.argv.slice(2);
application.start(parameters);

