module.exports = class Command1 {
  getName() {
    return "command1";
  }

  execute() {
    this.internalExecute();
  }

  displayHelp() {
    this.internalHelp();
  }

  internalExecute() {
    process.stdout.write("command1 output");
  }

  internalHelp() {
    process.stdout.write("command1 help");
  }
};
