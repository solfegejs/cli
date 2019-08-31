module.exports = class Command4 {
  getName() {
    return "command4";
  }

  execute() {
    throw new Error("Unexpected error");
  }
};
