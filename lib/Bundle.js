const colors = require("colors/safe");
const minimist = require("minimist");
const CommandCompilerPass = require("./DependencyInjection/Compiler/CommandCompilerPass");

module.exports = class Bundle {
  getPath() {
    return __dirname;
  }

  initialize(application) {
    application.on("start", this.onStart.bind(this));
  }

  configureContainer(container) {
    container.addCompilerPass(new CommandCompilerPass());
  }

  async onStart(application, parameters) {
    const container = application.getParameter("serviceContainer");
    if (!container) {
      throw new Error("Service container not available");
    }

    // Get commands
    let commands = [];
    try {
      const commandsRegistry = await container.get("solfege_console_commands_registry");
      commands = commandsRegistry.getCommands();
    } catch (error) {
      throw new Error(`[CLI] Unable to get commands: ${error.message}`);
    }

    // Split parameters and options
    const args = minimist(parameters);
    parameters = args._;
    const options = Object.assign({}, args);
    delete options._;

    // Configure commands
    // and create a map
    const commandMap = new Map();
    for (let command of commands) {
      // Check signature requirements
      if (typeof command.getName !== "function") {
        throw new Error(`Command must implement "getName" method.`);
      }

      if (typeof command.configure === "function") {
        await command.configure();
      }

      const name = command.getName();
      commandMap.set(name, command);
    }

    // Check if the user executes a command
    if (parameters.length > 0) {
      const commandName = parameters.shift();

      if (commandMap.has(commandName)) {
        const command = commandMap.get(commandName);

        // Execute the command
        const commandParameters = parameters.slice(0);
        if (command) {
          await command.execute(commandParameters, options);
        }
        return;
      }
    }

    // Display the header
    const title = "SolfegeJS CLI";
    process.stdout.write(colors.bgBlack.cyan(title) + "\n");
    process.stdout.write(colors.bgBlack.cyan("-".repeat(title.length)) + "\n\n");

    // Display command list
    await this.displayAvailableCommands(commands);
  }

  async displayAvailableCommands(commands) {
    for (let command of commands) {
      const name = command.getName();
      let description = "";

      // @todo Find a way to type the optional getDescription() method
      if (typeof command.getDescription === "function") {
        description = command.getDescription();
      }

      process.stdout.write(`${colors.green(name)}   ${description}\n`);
    }
  }
};
