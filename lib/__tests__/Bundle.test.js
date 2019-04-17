const Application = require("@solfege/application");
const CommandsRegistry = require("../CommandsRegistry");
const Bundle = require("../Bundle");

describe("Bundle", () => {
  const command1 = {
    getName: () => {
      return "Command 1";
    }
  };
  const command2 = {
    getName: () => {
      return "Command 2";
    }
  };

  const runApplication = async (commands, parameters = []) => {
    const registry = new CommandsRegistry();
    commands.forEach(command => {
      registry.addCommand(command);
    });

    const application = new Application();
    application.setParameter("serviceContainer", {
      get: name => {
        if (name === "solfege_console_commands_registry") {
          return registry;
        }
      }
    });

    const bundle = new Bundle();
    application.addBundle(bundle);

    await application.start(parameters);
  };

  it("should display command list by default", async () => {
    let stdout = "";
    process.stdout.write = output => {
      stdout += output;
    };

    const commands = [command1, command2];

    await runApplication(commands);
    expect(stdout).toMatchSnapshot();
  });
});
