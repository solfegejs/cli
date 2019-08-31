module.exports = class AbstractCommand {
  constructor() {
    this.description = "";
    this.arguments = [];
    this.optionalArguments = [];
    this.options = [];
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

  getArguments() {
    return this.arguments;
  }

  addArgument(name, description) {
    this.arguments.push({ name, description });
  }

  getOptionalArguments() {
    return this.optionalArguments;
  }

  addOptionalArgument(name, description) {
    this.optionalArguments.push({ name, description });
  }

  getOptions() {
    return this.options;
  }

  addOption(flags, description, defaultValue) {
    this.options.push({ flags, description, defaultValue });
  }

  async configure() {
    // To override
  }

  async execute() {
    throw new Error(`You must implement "execute" method`);
  }
};
