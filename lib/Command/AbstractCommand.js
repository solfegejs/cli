module.exports = class AbstractCommand {
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

  async execute() {
    throw new Error(`You must implement execute method`);
  }
};
