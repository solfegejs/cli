"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CommandsRegistry = class CommandsRegistry {
  constructor(container) {
    this.container = container;

    this.commands = new Set();
  }

  addCommand(command) {
    if (typeof command.setContainer === "function") {
      command.setContainer(this.container);
    }

    this.commands.add(command);
  }

  getCommands() {
    return this.commands;
  }
};
exports.default = CommandsRegistry;