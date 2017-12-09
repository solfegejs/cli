"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AbstractCommand = class AbstractCommand {
  constructor() {
    this.description = "";
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getDescription() {
    return this.description;
  }

  setDescription(description) {
    this.description = description;
  }

  async configure() {}

  async execute() {}
};
exports.default = AbstractCommand;