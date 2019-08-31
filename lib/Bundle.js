const commander = require("commander");
const PrettyError = require("pretty-error");
const wrap = require("word-wrap");
const assert = require("assert");
const CommandCompilerPass = require("./DependencyInjection/Compiler/CommandCompilerPass");

const prettyError = new PrettyError();
prettyError.appendStyle({
  "pretty-error": {
    margin: "0"
  },
  "pretty-error > header": {
    display: "block",
    background: "red",
    color: "white",
    marginBottom: "1"
  },
  "pretty-error > header > title": {
    display: "none"
  },
  "pretty-error > header > colon": {
    display: "none"
  }
});
prettyError.skipNodeFiles();
prettyError.skip(traceLine => {
  // Skip NodeJS internal files
  if (traceLine.path.indexOf("internal/") === 0) {
    return true;
  }
  return false;
});

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
    const [bin, filePath] = process.argv;

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
    for (const command of commands) {
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

      let commandDefinition = command.getName();
      const argumentDescriptions = {};

      if (typeof command.getArguments === "function") {
        const commandArguments = command.getArguments();
        if (Array.isArray(commandArguments)) {
          commandArguments.forEach(({ name, description }) => {
            commandDefinition += ` <${name}>`;
            argumentDescriptions[name] = description || "";
          });
        }
      }

      if (typeof command.getOptionalArguments === "function") {
        const commandArguments = command.getOptionalArguments();
        if (Array.isArray(commandArguments)) {
          commandArguments.forEach(({ name, description }) => {
            commandDefinition += ` [${name}]`;
            argumentDescriptions[name] = description || "";
          });
        }
      }

      const programCommand = program.command(commandDefinition);
      programCommand.action(async (...args) => {
        try {
          await command.execute(...args);
        } catch (error) {
          this.displayError(error);
          process.exit(1);
        }
      });

      if (typeof command.getOptions === "function") {
        const options = command.getOptions();
        options.forEach(({ flags, description, defaultValue }) => {
          programCommand.option(flags, description, defaultValue);
        });
      }

      if (typeof command.getDescription === "function") {
        const description = command.getDescription();
        programCommand.description(description, argumentDescriptions);
      }

      if (typeof command.displayHelp === "function") {
        programCommand.on("--help", (...args) => {
          command.displayHelp(...args);
        });
      }
    }

    return program;
  }

  displayError(error) {
    const newError = error;
    if (newError instanceof assert.AssertionError) {
      newError.kind = "AssertionError [ERR_ASSERTION]:";
    }

    const availableWidth = process.stderr.columns - 4;
    const borderTop = `┌─${"─".repeat(availableWidth)}─┐`;
    const borderBottom = `└─${"─".repeat(availableWidth)}─┘`;
    const wrappedMessage = wrap(error.message, {
      width: availableWidth,
      indent: "",
      trim: false,
      escape: row => {
        let newRow = "│ ";
        newRow += row + " ".repeat(availableWidth - row.length);
        newRow += " │";
        return newRow;
      }
    });
    let newMessage = "\n";
    newMessage += borderTop;
    newMessage += "\n";
    newMessage += wrappedMessage;
    newMessage += "\n";
    newMessage += borderBottom;
    newError.message = newMessage;
    process.stderr.write(prettyError.render(newError));
  }
};
