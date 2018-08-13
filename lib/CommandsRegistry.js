module.exports = class CommandsRegistry {
  constructor(container) {
    this.container = container;

    this.commands = new Set();
  }

  addCommand(command) {
    // @todo How to check if the command is container aware?
    if (typeof command.setContainer === "function") {
      command.setContainer(this.container);
    }

    this.commands.add(command);
  }

  getCommands() {
    return this.commands;
  }
};
