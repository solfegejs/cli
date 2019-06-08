const Application = require("@solfege/application");
const CommandsRegistry = require("../../lib/CommandsRegistry");
const Bundle = require("../../lib/Bundle");

const application = new Application();
const registry = new CommandsRegistry();
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

