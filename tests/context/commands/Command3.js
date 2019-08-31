const AbstractCommand = require("../../../lib/Command/AbstractCommand");

module.exports = class Command3 extends AbstractCommand {
  constructor() {
    super();

    this.setName("command3");
    this.setDescription("command3 description");
    this.addArgument("arg1", "First argument");
    this.addArgument("arg2");
    this.addOptionalArgument("arg3", "Third argument");
    this.addOptionalArgument("arg4");
    this.addOption("--opt1 <value>", "Option 1", "foo");
    this.addOption("--opt2", "Option 2");
    this.addOption("--opt3");
  }


  execute() {
    process.stdout.write("command3 output");
  }

  displayHelp() {
    process.stdout.write("command3 help");
  }
};
