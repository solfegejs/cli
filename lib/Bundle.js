const commander = require("commander");
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
    const program = await this.initializeProgram(application);
    const [ bin, filePath ] = process.argv;

    program.parse([bin, filePath, ...parameters]);

    const noCommandSpecified = program.args.length === 0;
    if (noCommandSpecified) {
      program.help();
    }
  }

  async initializeProgram(application) {
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

    const program = new commander.Command();

    // Configure commands
    for (let command of commands) {
      // Check signature requirements
      if (typeof command.getName !== "function") {
        throw new Error(`Command must implement "getName" method.`);
      }
      if (typeof command.execute !== "function") {
        throw new Error(`Command must implement "execute" method.`);
      }

      if (typeof command.configure === "function") {
        await command.configure();
      }

      const programCommand = program.command(command.getName());
      programCommand.action((...args) => {
        command.execute.apply(command, args);
      });

      if (typeof command.getDescription === "function") {
        programCommand.description(command.getDescription());
      }

      if (typeof command.displayHelp === "function") {
        programCommand.on("--help", (...args) => {
          command.displayHelp.apply(command, args);
        });
      }
    }

    return program;
  }
};
